import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../models/User';
import { mockUsers } from 'src/__mocks__/mockUsers';
import { UserSetting } from '../models/UserSetting';
import { CreateUserInput } from '../utils/CreateUserInput';
import { UserService } from '../services/user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => User)
  getUser() {
    return {
      id: 1,
      username: 'john_doe',
      email: 'VYjgM@example.com',
      displayName: 'John Doe',
    };
  }

  @Query(() => User)
  async getUserById(@Args('id', { type: () => String }) id: string) {
    return this.userService.getUserById(id);
  }

  @Query((returns) => [User])
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @ResolveField((returns) => UserSetting, { name: 'settings', nullable: true })
  getUserSettings(@Parent() user: User) {
    // return mockUserSettings.find((setting) => setting.userId === user.id);
  }

  @Mutation((returns) => User)
  async createUser(@Args('createUserData') createUserData: CreateUserInput) {
    return await this.userService.createUser(createUserData);
  }
}
