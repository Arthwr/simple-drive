import prisma from '../config/prismaClient';
import UserRepository from '../repository/UserRepository';

class UserService {
  private userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  async findUserByEmail(userEmail: string) {
    return await this.userRepo.findByEmail(userEmail);
  }

  async findUserById(userId: string) {
    return await this.userRepo.findById(userId);
  }
}

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);

export default userService;
