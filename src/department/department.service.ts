import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './create-department.dto';
import { UpdateDepartmentDto } from './update-department.dto';

@Injectable()
export class DepartmentService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createDepartmentDto: CreateDepartmentDto) {
		return this.prisma.department.create({
			data: {
				name: createDepartmentDto.name,
				description: createDepartmentDto.description ?? null,
			},
		});
	}

	async findAll() {
		return this.prisma.department.findMany();
	}

	async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
		try {
			return await this.prisma.department.update({
				where: { id },
				data: updateDepartmentDto,
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new NotFoundException('Department not found');
			}
			throw error;
		}
	}

	async remove(id: number) {
		try {
			await this.prisma.department.delete({ where: { id } });
			return { message: 'Department deleted successfully' };
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new NotFoundException('Department not found');
			}
			throw error;
		}
	}
}
