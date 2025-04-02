import { Folder, PrismaClient, RoleEnum, Storage, User } from '@prisma/client';

class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Read methods
  async findByEmail(userEmail: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email: userEmail } });
  }

  async findById(userId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async getStorage(userId: string): Promise<Storage | null> {
    return await this.prisma.storage.findUnique({
      where: { userId },
    });
  }

  // // Write methods
  async addMember(email: string, password: string): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email,
        password,
        role: {
          connect: { name: RoleEnum.MEMBER },
        },
        storage: {
          create: {},
        },
      },
    });
  }

  async addFolder(
    repositoryId: string,
    parentId: string | null,
    name: string,
  ): Promise<Folder> {
    return await this.prisma.folder.create({
      data: {
        repositoryId,
        parentId,
        name,
      },
    });
  }
}

export default UserRepository;
