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

  async isFolderNameUnique(
    name: string,
    parentId: string | null,
    repositoryId: string,
  ): Promise<boolean> {
    const count = await this.prisma.folder.count({
      where: {
        name,
        parentId,
        repositoryId,
      },
    });

    return count === 0;
  }

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

  async findFolderContentById(
    folderId: string,
  ): Promise<(Folder & { children: Folder[]; files: File[] }) | null> {
    return this.prisma.folder.findUnique({
      where: {
        id: folderId,
      },
      include: {
        children: true,
        files: true,
      },
    });
  }

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

  async findFolderChildrenAndFilePaths(
    folderId: string,
  ): Promise<{ childrenIds: string[]; filePaths: string[] }> {
    const folder = await this.prisma.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        children: {
          select: { id: true },
        },
        files: {
          select: {
            storagePath: true,
          },
        },
      },
    });

    if (!folder) {
      return { childrenIds: [], filePaths: [] };
    }

    const paths = folder.files.map((f) => f.storagePath).filter((p) => p);

    return {
      childrenIds: folder.children.map((c) => c.id),
      filePaths: paths,
    };
  }

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
    return this.prisma.folder.create({
      data: {
        repositoryId,
        parentId,
        name,
      },
    });
  }

  async addFile(
    name: string,
    size: bigint,
    url: string,
    folderId: string,
    storagePath: string,
  ): Promise<File> {
    return this.prisma.file.create({
      data: {
        name,
        size,
        url,
        folderId,
        storagePath,
      },
    });
  }

  async addManyFiles(
    storagePath: {
      name: string;
      size: bigint;
      url: string;
      storagePath: string;
      folderId: string;
    }[] = [],
  ) {
    return this.prisma.file.createMany({
      data: storagePath,
    });
  }

  // Delete methods
  async deleteFolder(folderId: string): Promise<Folder> {
    return this.prisma.folder.delete({
      where: {
        id: folderId,
      },
    });
  }

  async deleteFile(publicId: string, folderId: string): Promise<File> {
    return this.prisma.file.delete({
      where: {
        publicId_folderId: {
          publicId,
          folderId,
        },
      },
    });
  }
}

export default UserRepository;
