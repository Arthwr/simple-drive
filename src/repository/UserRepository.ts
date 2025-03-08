import { PrismaClient, User } from '@prisma/client';

class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByEmail(userEmail: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email: userEmail } });
  }

  async findById(userId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }
}

export default UserRepository;
