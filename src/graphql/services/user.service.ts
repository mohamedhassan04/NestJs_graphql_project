import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/User';
import { Repository } from 'typeorm';
import { CreateUserInput } from '../utils/CreateUserInput';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
  ) {}

  async createUser(createUserData: CreateUserInput) {
    const newUser = this._userRepository.create(createUserData);
    return this._userRepository.save(newUser);
  }

  async getUserById(id: string) {
    const user = await this._userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async getAllUsers() {
    return this._userRepository.find();
  }
}
