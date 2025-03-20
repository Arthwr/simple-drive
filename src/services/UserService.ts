import bcryptjs from 'bcryptjs';

import prisma from '../config/prismaClient';
import { UserExistsError } from '../errors/NotifyError';
import UserRepository from '../repository/UserRepository';

class UserService {
  private userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  // Read methods
  async findUserByEmail(userEmail: string) {
    return await this.userRepo.findByEmail(userEmail);
  }

  async findUserById(userId: string) {
    return await this.userRepo.findById(userId);
  }

  async userExists(userEmail: string): Promise<boolean> {
    const existingUser = await this.findUserByEmail(userEmail);
    return existingUser !== null;
  }

  // Write methods
  async addUserMember(userEmail: string, password: string) {
    if (await this.userExists(userEmail)) {
      throw new UserExistsError();
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    return await this.userRepo.addMember(userEmail, hashedPassword);
  }
}

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);

export default userService;
