import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UserService {
  // In-memory users array for demonstration
  private users: Array<CreateUserDto & { id: number }> = [];

  findAll() {
    return this.users;
  }

  create(createUserDto: CreateUserDto) {
    const user = { id: Date.now(), ...createUserDto };
    this.users.push(user);
    return user;
  }
}
