import {
  File,
  Folder,
  PrismaClient,
  RoleEnum,
  Storage,
  User,
} from '@prisma/client';

import { ParentFolderInfo } from '../types/directory.types';

class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Read methods
  async findUserByEmail(userEmail: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email: userEmail } });
  }

  async findUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async findStorageByUserId(userId: string): Promise<Storage | null> {
    return this.prisma.storage.findUnique({
      where: { userId },
    });
  }

  // ---- Get root level folder id
  async findRootFolderId(repositoryId: string): Promise<string | null> {
    const rootFolder = await this.prisma.folder.findFirst({
      where: {
        repositoryId,
        parentId: null,
      },
      select: { id: true },
    });

    return rootFolder?.id ?? null;
  }

  // ---- Get parent folder
  async findParentFolderById(
    parentId: string,
  ): Promise<ParentFolderInfo | null> {
    return this.prisma.folder.findUnique({
      where: {
        id: parentId,
      },
      select: {
        id: true,
        publicId: true,
        name: true,
        parentId: true,
      },
    });
  }

  // ---- Get folder id by its public id
  async findFolderIdByPublicId(
    repositoryId: string,
    publicId: string,
  ): Promise<string | null> {
    const folder = await this.prisma.folder.findUnique({
      where: {
        repositoryId_publicId: {
          repositoryId,
          publicId,
        },
      },
      select: {
        id: true,
      },
    });

    return folder?.id ?? null;
  }

  // ---- Get root level folders and files of user repository
  async findRootFolderWithContents(
    repositoryId: string,
  ): Promise<(Folder & { children: Folder[]; files: File[] }) | null> {
    return this.prisma.folder.findFirst({
      where: {
        repositoryId,
        parentId: null,
      },
      include: {
        children: true,
        files: true,
      },
    });
  }

  // ---- Get specific folder and its direct children/files
  async findFolderWithContents(
    repositoryId: string,
    publicId: string,
  ): Promise<
    | (Folder & { children: Folder[]; files: File[]; parent: Folder | null })
    | null
  > {
    return this.prisma.folder.findUnique({
      where: {
        repositoryId_publicId: {
          repositoryId,
          publicId,
        },
      },
      include: {
        parent: true,
        children: true,
        files: true,
      },
    });
  }

  // Write methods
  async addMember(email: string, password: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        password,
        role: {
          connect: { name: RoleEnum.MEMBER },
        },
        storage: {
          create: {
            folders: {
              create: [
                {
                  name: '__root__',
                  parentId: null,
                },
              ],
            },
          },
        },
      },
    });
  }

  async addFolder(
    repositoryId: string,
    parentId: string | null,
    name: string,
  ): Promise<Folder> {
    // TO DO: Prevent duplicate name check
    return this.prisma.folder.create({
      data: {
        repositoryId,
        parentId,
        name,
      },
    });
  }
}

export default UserRepository;
