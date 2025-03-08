import { PrismaClient, User } from '@prisma/client';

const UserRepository = (prisma: PrismaClient) => ({
  findByEmail: async (userEmail: string): Promise<User | null> => {
    return await prisma.user.findUnique({ where: { email: userEmail } });
  },

  findById: async (userId: string): Promise<User | null> => {
    return await prisma.user.findUnique({ where: { id: userId } });
  },
});

export default UserRepository;
