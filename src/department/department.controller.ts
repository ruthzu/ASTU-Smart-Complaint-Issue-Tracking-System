import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateDepartmentDto } from './create-department.dto';
import { UpdateDepartmentDto } from './update-department.dto';
import { DepartmentService } from './department.service';

@Controller('departments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentController {
	constructor(private readonly departmentService: DepartmentService) {}

	@Post()
	@Roles(Role.ADMIN)
	create(@Body() createDepartmentDto: CreateDepartmentDto) {
		return this.departmentService.create(createDepartmentDto);
	}

	@Get()
	@Roles(Role.ADMIN)
	findAll() {
		return this.departmentService.findAll();
	}

	@Patch(':id')
	@Roles(Role.ADMIN)
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateDepartmentDto: UpdateDepartmentDto,
	) {
		return this.departmentService.update(id, updateDepartmentDto);
	}

	@Delete(':id')
	@Roles(Role.ADMIN)
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.departmentService.remove(id);
	}
}
