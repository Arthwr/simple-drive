import prisma from '../config/prismaClient';
import UserRepository from '../repository/userRepository';

const userRepo = UserRepository(prisma);

export const UserService = {
  async findUserByEmail(userEmail: string) {
    return await userRepo.findByEmail(userEmail);
  },

  async findUserById(userId: string) {
    return await userRepo.findById(userId);
  },
};
