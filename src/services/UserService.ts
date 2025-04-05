import { File, Folder } from '@prisma/client';
import bcryptjs from 'bcryptjs';

import prisma from '../config/prismaClient';
import { UserExistsError } from '../errors/NotifyError';
import { NotifyError } from '../errors/NotifyError';
import UserRepository from '../repository/UserRepository';

interface DirectoryViewData {
  currentFolder: Folder | null;
  folders: Folder[];
  files: File[];
  breadcrumbs: Folder[];
}

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

  async getDirectoryData(
    userId: string,
    publicFolderId?: string,
  ): Promise<DirectoryViewData> {
    const storage = await userRepository.findStorageByUserId(userId);

    if (!storage) {
      throw new NotifyError('User storage not found', 500, '/dashboard');
    }

    let currentFolder: Folder | null = null;
    let folders: Folder[] = [];
    let files: File[] = [];
    let breadcrumbs: Folder[] = [];

    if (!publicFolderId) {
      const implicitRoot = await userRepository.findRootFolderWithContents(
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
      folders = folderData.children;
      files = folderData.files;
      breadcrumbs = []; // Implement ancestors search function from repository
    }

    return { currentFolder, folders, files, breadcrumbs };
  }

  // Write methods
  async addUserMember(userEmail: string, password: string) {
    if (await this.userExists(userEmail)) {
      throw new UserExistsError();
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    return await this.userRepo.addMember(userEmail, hashedPassword);
  }

  async addUserFolder(
    userId: string,
    parentPublicFolderId: string | null,
    folderName: string,
  ) {
    const storage = await userRepository.findStorageByUserId(userId);

    if (!storage) {
      throw new NotifyError('User storage not found', 404);
    }

    let implicitFolderId: string | null = null;

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

    return await userRepository.addFolder(
      storage.id,
      implicitFolderId,
      folderName,
    );
  }
}

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);

export default userService;
