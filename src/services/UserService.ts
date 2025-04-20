import { File, Folder } from '@prisma/client';
import bcryptjs from 'bcryptjs';

import prisma from '../config/prismaClient';
import { UserExistsError } from '../errors/NotifyError';
import { NotifyError } from '../errors/NotifyError';
import UserRepository from '../repository/UserRepository';
import { ParentFolderInfo } from '../types/directory.types';
import { DirectoryViewData } from '../types/directory.types';

class UserService {
  private userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

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

  async getFolderAncestors(startFolder: Folder): Promise<ParentFolderInfo[]> {
    const ancestors: ParentFolderInfo[] = [];
    let currentParentId: string | null = startFolder.parentId;

    while (currentParentId) {
      const parentInfo =
        await this.userRepo.findParentFolderById(currentParentId);

      if (!parentInfo || !parentInfo.parentId) {
        break;
      }

      ancestors.push(parentInfo);
      currentParentId = parentInfo.parentId;
    }

    return ancestors.reverse();
  }

  async getDirectoryData(
    userId: string,
    publicFolderId?: string,
  ): Promise<DirectoryViewData> {
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
      const implicitRoot = await this.userRepo.findRootFolderWithContents(
        storage.id,
      );

      if (!implicitRoot) {
        throw new NotifyError(
          'Cannot load root directory contents',
          500,
          '/dashboard',
        );
      }

      currentFolder = null;
      parentFolder = null;
      folders = implicitRoot.children;
      files = implicitRoot.files;
      breadcrumbs = [];
    } else {
      const folderData = await this.userRepo.findFolderWithContents(
        storage.id,
        publicFolderId,
      );

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

  async addUserFolder(
    userId: string,
    parentPublicFolderId: string | null,
    folderName: string,
  ) {
    const storage = await this.userRepo.findStorageByUserId(userId);

    if (!storage) {
      throw new NotifyError('User storage not found', 404);
    }

    let implicitFolderId: string;

    if (!parentPublicFolderId) {
      const rootFolderId = await this.userRepo.findRootFolderId(storage.id);

      if (!rootFolderId) {
        throw new NotifyError(
          'Cannot find root directory to create folder in',
          500,
        );
      }

      implicitFolderId = rootFolderId;
    } else {
      const parentFolderId = await this.userRepo.findFolderIdByPublicId(
        storage.id,
        parentPublicFolderId,
      );

      if (!parentFolderId) {
        throw new NotifyError('Parent folder was not found', 404);
      }

      implicitFolderId = parentFolderId;
    }

    const unique = await this.userRepo.isFolderNameUnique(
      folderName,
      implicitFolderId,
      storage.id,
    );

    if (!unique) {
      throw new NotifyError(
        'A folder with that name already exists in this location',
        409,
        parentPublicFolderId
          ? `/dashboard/${parentPublicFolderId}`
          : '/dashboard',
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
  ) {
    const storage = await this.userRepo.findStorageByUserId(userId);

    if (!storage) {
      throw new NotifyError('User storage not found', 404);
    }

    let implicitFolderId: string;

    if (!folderPublicId) {
      const rootFolderId = await this.userRepo.findRootFolderId(storage.id);
      if (!rootFolderId) {
        throw new NotifyError('Cannot find directory to create file in', 500);
      }

      implicitFolderId = rootFolderId;
    } else {
      const folderId = await this.userRepo.findFolderIdByPublicId(
        storage.id,
        folderPublicId,
      );
      if (!folderId) {
        throw new NotifyError('Cannot find directory to create file in', 500);
      }

      implicitFolderId = folderId;
    }

    return this.userRepo.addFile(fileName, fileSize, fileUrl, implicitFolderId);
  }
}

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);

export default userService;
