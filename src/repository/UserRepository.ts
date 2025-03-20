import { PrismaClient, RoleEnum, User } from '@prisma/client';

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
    return await this.prisma.user.findUnique({ where: { id: userId } });
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
}

export default UserRepository;
