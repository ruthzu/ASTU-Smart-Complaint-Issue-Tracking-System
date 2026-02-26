import {
	Body,
	Controller,
	Get,
	Query,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Req,
	UnauthorizedException,
	BadRequestException,
	UseGuards,
} from '@nestjs/common';
import type { Request, Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { complaintFileMulterOptions } from './complaint-file-upload.options';
import { UploadedFile, UseInterceptors } from '@nestjs/common';

import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateComplaintDto } from './create-complaint.dto';
import { AssignDepartmentDto } from './assign-department.dto';
import { ComplaintService } from './complaint.service';
import { UpdateComplaintDto } from './update-complaint.dto';

@Controller('complaints')
export class ComplaintController {
	constructor(private readonly complaintService: ComplaintService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('file', complaintFileMulterOptions))
	async createComplaint(
		@Body() createComplaintDto: CreateComplaintDto,
		@UploadedFile() file: Express.Multer.File | undefined,
		@Req() request: Request,
	) {
		const user = request.user as { id: number } | undefined;
		if (!user?.id) {
			throw new UnauthorizedException('User not authenticated');
		}

		// Additional manual validation (should not be needed, but for safety)
		if (file) {
			const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
			if (!allowedTypes.includes(file.mimetype)) {
				throw new BadRequestException('Only jpg, png, and pdf files are allowed');
			}
			if (file.size > 5 * 1024 * 1024) {
				throw new BadRequestException('File size exceeds 5MB');
			}
		}

		const dto: CreateComplaintDto = { ...createComplaintDto };
		if (file?.filename) {
			dto.attachment = file.filename;
		}

		return this.complaintService.createComplaint(dto, user.id);
	}

	@Get()
	async listComplaints(
		@Query('page') page: string = '1',
		@Query('limit') limit: string = '10',
	) {
		const pageNum = Math.max(1, parseInt(page, 10) || 1);
		const limitNum = Math.max(1, parseInt(limit, 10) || 10);
		return this.complaintService.listComplaintsPaginated(pageNum, limitNum);
	}

	@Get('staff')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.STAFF, Role.ADMIN)
	async listComplaintsForStaff(
		@Req() request: Request,
		@Query('departmentId') departmentId?: string,
	) {
		const user = request.user as { id: number; role: Role } | undefined;
		if (!user?.id || !user.role) {
			throw new UnauthorizedException('User not authenticated');
		}

		let deptId: number | undefined;
		if (departmentId !== undefined) {
			const parsed = Number(departmentId);
			if (Number.isNaN(parsed) || parsed < 1) {
				throw new BadRequestException('departmentId must be a positive number');
			}
			deptId = parsed;
		}

		return this.complaintService.listComplaintsForUser({ id: user.id, role: user.role }, deptId);
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.STAFF, Role.ADMIN)
	async updateComplaint(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateComplaintDto: UpdateComplaintDto,
		@Req() request: Request,
	) {
		const user = request.user as { id: number; role: Role } | undefined;
		if (!user?.id || !user.role) {
			throw new UnauthorizedException('User not authenticated');
		}

		return this.complaintService.updateComplaint(
			id,
			updateComplaintDto,
			{ id: user.id, role: user.role },
		);
	}

	@Patch(':id/assign-department')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	async assignDepartment(
		@Param('id', ParseIntPipe) id: number,
		@Body() assignDepartmentDto: AssignDepartmentDto,
	) {
		return this.complaintService.assignDepartment(id, assignDepartmentDto);
	}
}
