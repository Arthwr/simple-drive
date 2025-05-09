import { File, Folder, Prisma } from '@prisma/client';
import bcryptjs from 'bcryptjs';

import { FlashMessages } from '../config/constants';
import prisma from '../config/prismaClient';
import supabase from '../config/supabaseClient';
import { UserExistsError } from '../errors/NotifyError';
import { NotifyError } from '../errors/NotifyError';
import UserRepository from '../repository/UserRepository';
import { ParentFolderInfo } from '../types/directory.types';
import { DirectoryViewData } from '../types/directory.types';
import fixMulterEncoding from '../utils/fixMulterEncoding';
import StorageService from './StorageService';

class UserService {
  constructor(
    private userRepo: UserRepository,
    private storageService: StorageService,
  ) {}

  // Read methods
  async findUserByEmail(userEmail: string) {
    return this.userRepo.findUserByEmail(userEmail);
  }

  async findUserById(userId: string) {
    return this.userRepo.findUserById(userId);
  }

  async userExists(userEmail: string): Promise<boolean> {
    const existingUser = await this.findUserByEmail(userEmail);
    return existingUser !== null;
  }

  async traverseFolders(folderId: string): Promise<TreeFolder> {
    const folderContents = await this.userRepo.findFolderContentById(folderId);
    if (!folderContents) {
      throw new NotifyError(`Couldn't find folder during tree render`, 500);
    }

    let children: TreeFolder[] | undefined = undefined;

    if (folderContents.children && folderContents.children.length > 0) {
      children = await Promise.all(folderContents.children.map(async (folder) => this.traverseFolders(folder.id)));
    }

    return {
      name: folderContents.name,
      publicUrl: folderContents.publicId,
      files: folderContents?.files.map((file) => ({ name: file.name })),
      children: children,
    };
  }

  async getFileDescendantsStoragePaths(userId: string, publicFolderId: string) {
    const allStoragePaths: string[] = [];

    const storage = await this.userRepo.findStorageByUserId(userId);
    if (!storage) {
      throw new NotifyError('User storage not found', 500, '/dashboard');
    }

    const startFolderId = await this.userRepo.findFolderIdByPublicId(storage.id, publicFolderId);
    if (!startFolderId) {
      throw new NotifyError('Failed to find requested folder in your storage', 500);
    }

    const stack: string[] = [startFolderId];
    const processedFolders = new Set<string>();

    while (stack.length > 0) {
      const currentFolderId = stack.pop();

      if (!currentFolderId || processedFolders.has(currentFolderId)) {
        continue;
      }

      processedFolders.add(currentFolderId);

      const { childrenIds, filePaths } = await this.userRepo.findFolderChildrenAndFilePaths(currentFolderId);

      if (filePaths.length > 0) {
        allStoragePaths.push(...filePaths);
      }

      if (childrenIds.length > 0) {
        stack.push(...childrenIds);
      }
    }

    return allStoragePaths;
  }

  async getFolderAncestors(startFolder: Folder): Promise<ParentFolderInfo[]> {
    const ancestors: ParentFolderInfo[] = [];
    let currentParentId: string | null = startFolder.parentId;

    while (currentParentId) {
      const parentInfo = await this.userRepo.findParentFolderById(currentParentId);

      if (!parentInfo || !parentInfo.parentId) {
        break;
      }

      ancestors.push(parentInfo);
      currentParentId = parentInfo.parentId;
    }

    return ancestors.reverse();
  }

  async getRootFolderTree(rootFolderId: string): Promise<{ folders: TreeFolder[]; files: TreeFile[] } | undefined> {
    const rootContent = await this.userRepo.findFolderContentById(rootFolderId);
    if (!rootContent) {
      throw new NotifyError('Root folder not found', 500);
    }

    let tree: {
      folders: TreeFolder[];
      files: TreeFile[];
    } = {
      folders: [],
      files: [],
    };

    if (rootContent.files && rootContent.files.length > 0) {
      tree.files = rootContent.files.map((file) => ({ name: file.name }));
    }

    if (rootContent.children) {
      tree.folders = await Promise.all(rootContent.children.map(async (folder) => this.traverseFolders(folder.id)));
    }

    return tree;
  }

  async getUserFolderHierarchy(userId: string) {
    const storage = await this.userRepo.findStorageByUserId(userId);
    if (!storage) {
      throw new NotifyError('User storage not found', 500, '/dashboard');
    }

    const rootFolder = await this.userRepo.findRootFolderWithContents(storage.id);

    if (!rootFolder) {
      throw new NotifyError('Cannot load root directory contents', 500, '/dashboard');
    }

    return this.getRootFolderTree(rootFolder.id);
  }

  async getFolderSize(folderId: string): Promise<bigint> {
    let size: bigint | null = BigInt(0);

    const stack: string[] = [folderId];

    while (stack.length > 0) {
      const currentFolderId = stack.pop();
      if (!currentFolderId) continue;

      const folderContent = await this.userRepo.findFolderContentById(currentFolderId);

      if (!folderContent) continue;

      if (folderContent.files && folderContent.files.length > 0) {
        size += folderContent.files.reduce((acc, file) => acc + file.size, BigInt(0));
      }

      if (folderContent.children && folderContent.children.length > 0) {
        for (const child of folderContent.children) {
          stack.push(child.id);
        }
      }
    }

    return size;
  }

  async getDirectoryData(userId: string, publicFolderId?: string): Promise<DirectoryViewData> {
    const storage = await this.userRepo.findStorageByUserId(userId);

    if (!storage) {
      throw new NotifyError('User storage not found', 500, '/dashboard');
    }

    let currentFolder: Folder | null = null;
    let parentFolder: Folder | null = null;
    let folders: Folder[] = [];
    let files: File[] = [];
    let breadcrumbs: ParentFolderInfo[] = [];

    if (!publicFolderId) {
      const implicitRoot = await this.userRepo.findRootFolderWithContents(storage.id);

      if (!implicitRoot) {
        throw new NotifyError('Cannot load root directory contents', 500, '/dashboard');
      }

      currentFolder = implicitRoot;
      parentFolder = null;
      folders = implicitRoot.children;
      files = implicitRoot.files;
      breadcrumbs = [];
    } else {
      const folderData = await this.userRepo.findFolderWithContents(storage.id, publicFolderId);

      if (!folderData) {
        throw new NotifyError('Folder not found', 500, '/dashboard');
      }

      currentFolder = folderData;
      parentFolder = folderData.parent;
      folders = folderData.children;
      files = folderData.files;
      breadcrumbs = await this.getFolderAncestors(currentFolder);
    }

    return { currentFolder, parentFolder, folders, files, breadcrumbs };
  }

  // Write methods
  async addUserMember(userEmail: string, password: string) {
    if (await this.userExists(userEmail)) {
      throw new UserExistsError();
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    return this.userRepo.addMember(userEmail, hashedPassword);
  }

  async addUserFolder(userId: string, parentPublicFolderId: string | null, folderName: string) {
    const storage = await this.userRepo.findStorageByUserId(userId);
    if (!storage) {
      throw new NotifyError('User storage not found', 404);
    }

    let implicitFolderId: string;

    if (!parentPublicFolderId) {
      const rootFolderId = await this.userRepo.findRootFolderId(storage.id);

      if (!rootFolderId) {
        throw new NotifyError('Cannot find root directory to create folder in', 500);
      }

      implicitFolderId = rootFolderId;
    } else {
      const parentFolderId = await this.userRepo.findFolderIdByPublicId(storage.id, parentPublicFolderId);

      if (!parentFolderId) {
        throw new NotifyError('Parent folder was not found', 404);
      }

      implicitFolderId = parentFolderId;
    }

    const unique = await this.userRepo.isFolderNameUnique(folderName, implicitFolderId, storage.id);

    if (!unique) {
      throw new NotifyError(
        'A folder with that name already exists in this location',
        409,
        parentPublicFolderId ? `/dashboard/${parentPublicFolderId}` : '/dashboard',
      );
    }

    return this.userRepo.addFolder(storage.id, implicitFolderId, folderName);
  }

  async addUserFile(
    userId: string,
    fileName: string,
    fileSize: bigint,
    fileUrl: string,
    folderPublicId: string | null,
    storagePath: string,
  ) {
    const storage = await this.userRepo.findStorageByUserId(userId);
    if (!storage) {
      throw new NotifyError('User storage not found', 404);
    }

    let primaryFolderId: string;

    if (!folderPublicId) {
      const rootFolderId = await this.userRepo.findRootFolderId(storage.id);
      if (!rootFolderId) {
        throw new NotifyError('Cannot find directory to create file in', 500);
      }

      primaryFolderId = rootFolderId;
    } else {
      const folderId = await this.userRepo.findFolderIdByPublicId(storage.id, folderPublicId);
      if (!folderId) {
        throw new NotifyError('Cannot find directory to create file in', 500);
      }

      primaryFolderId = folderId;
    }

    return this.userRepo.addFile(fileName, fileSize, fileUrl, primaryFolderId, storagePath);
  }

  // Delete methods
  async deleteUserFolderFromDB(userId: string, folderPublicId: string) {
    const storage = await this.userRepo.findStorageByUserId(userId);
    if (!storage) {
      throw new NotifyError('User storage not found', 404);
    }

    const folderId = await this.userRepo.findFolderIdByPublicId(storage.id, folderPublicId);
    if (!folderId) {
      throw new NotifyError('Failed to find requested folder in your storage', 500);
    }

    try {
      return await this.userRepo.deleteFolder(folderId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotifyError('Failed to delete requested folder', 500);
      }

      throw error;
    }
  }

  async deleteUserFileFromDB(userId: string, filePublidId: string, folderParentPublicId: string) {
    const storage = await this.userRepo.findStorageByUserId(userId);
    if (!storage) {
      throw new NotifyError('User storage not found', 404);
    }

    const folderId = await this.userRepo.findFolderIdByPublicId(storage.id, folderParentPublicId);

    if (!folderId) {
      throw new NotifyError('Failed to find requested folder in your storage', 500);
    }

    try {
      return await this.userRepo.deleteFile(filePublidId, folderId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotifyError('Failed to delete requested file', 500);
      }

      throw error;
    }
  }

  // Orchestrate methods
  async uploadAndRegisterFiles(userId: string, parentPublicFolderId: string | null, files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new NotifyError(FlashMessages.FILE_NOT_PROVIDED, 400);
    }

    const storage = await this.userRepo.findStorageByUserId(userId);
    if (!storage) throw new NotifyError('User storage not found', 404);

    let targetFolderId: string | null = null;
    if (parentPublicFolderId) {
      targetFolderId = await this.userRepo.findFolderIdByPublicId(storage.id, parentPublicFolderId);
    } else {
      targetFolderId = await this.userRepo.findRootFolderId(storage.id);
    }

    if (!targetFolderId) {
      throw new NotifyError('Target folder not found.', 404);
    }

    const results: {
      success: boolean;
      message?: string;
      storagePath?: string;
    }[] = [];
    const pathsToRegister: {
      name: string;
      size: bigint;
      url: string;
      storagePath: string;
      folderId: string;
    }[] = [];
    const pathsToCleanOnError: string[] = [];

    // Upload and register loop
    for (const file of files) {
      let storagePath: string | undefined = undefined;
      let fixedName = fixMulterEncoding(file.originalname);

      try {
        // Upload to supabase
        storagePath = await this.storageService.uploadFile(file, userId);
        pathsToCleanOnError.push(storagePath);

        // Get supabase file downloadable url
        const fileUrl = await this.storageService.getFilePublicUrl(storagePath);

        // Prepare metadata for DB
        pathsToRegister.push({
          name: fixedName,
          size: BigInt(file.size),
          url: fileUrl,
          storagePath: storagePath,
          folderId: targetFolderId,
        });
        results.push({ success: true, storagePath });
      } catch (error: any) {
        console.error(`Failed to process file ${file.originalname}`, error);
        results.push({
          success: false,
          message: error.message || 'Upload/Processing Failed',
          storagePath,
        });
      }
    }

    if (pathsToRegister.length > 0) {
      try {
        await this.userRepo.addManyFiles(pathsToRegister);
      } catch (error) {
        console.error('Database error saving file metadata:', error);
        // Attempt to cleanup failed files at StorageService
        await this.storageService.deleteFiles(pathsToCleanOnError);
        throw new NotifyError('Failed to save some files after upload. Files were rolled back', 500);
      }
    }

    const successfulCount = results.filter((r) => r.success).length;
    const failedCount = files.length - successfulCount;
    const errors = results.filter((r) => !r.success).map((r) => r.message || 'Unknown error');

    return { successfulCount, failedCount, errors };
  }

  async deleteUserFolder(userId: string, folderPublicId: string): Promise<void> {
    const pathsToDelete = await this.getFileDescendantsStoragePaths(userId, folderPublicId);

    await this.storageService.deleteFiles(pathsToDelete);
    await this.deleteUserFolderFromDB(userId, folderPublicId);
  }

  async deleteUserFile(userId: string, folderPublicId: string, filePublicId: string) {
    const storage = await this.userRepo.findStorageByUserId(userId);
    if (!storage) throw new NotifyError('User storage not found', 404);

    let parentFolderId: string | null = null;
    if (folderPublicId) {
      parentFolderId = await this.userRepo.findFolderIdByPublicId(storage.id, folderPublicId);
    } else {
      parentFolderId = await this.userRepo.findRootFolderId(storage.id);
    }

    if (!parentFolderId) {
      throw new NotifyError('Parent folder of request file not found.', 404);
    }

    const fileToDelete = await this.userRepo.findFileByPublicIdFolderId(parentFolderId, filePublicId);

    if (!fileToDelete) {
      throw new NotifyError('Target file not found.', 404);
    }

    await this.storageService.deleteFiles([fileToDelete.storagePath]);
    await this.deleteUserFileFromDB(userId, filePublicId, folderPublicId);
  }
}

const userRepository = new UserRepository(prisma);
const storageService = new StorageService(supabase);

const userServiceInstance = new UserService(userRepository, storageService);
export default userServiceInstance;
