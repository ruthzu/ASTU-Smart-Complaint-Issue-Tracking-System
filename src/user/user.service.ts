import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma.service';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UserService {
  async create(data: CreateUserDto) {
    return prisma.user.create({ data });
  }

  async findAll() {
    return prisma.user.findMany();
  }

  async findOne(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, data: Partial<CreateUserDto>) {
    return prisma.user.update({ where: { id }, data });
  }

  async remove(id: number) {
    return prisma.user.delete({ where: { id } });
  }
}
