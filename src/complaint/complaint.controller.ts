import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Req,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateComplaintDto } from './create-complaint.dto';
import { ComplaintService } from './complaint.service';
import { UpdateComplaintDto } from './update-complaint.dto';

@Controller('complaints')
export class ComplaintController {
	constructor(private readonly complaintService: ComplaintService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	async createComplaint(
		@Body() createComplaintDto: CreateComplaintDto,
		@Req() request: Request,
	) {
		const user = request.user as { id: number } | undefined;
		if (!user?.id) {
			throw new UnauthorizedException('User not authenticated');
		}

		return this.complaintService.createComplaint(createComplaintDto, user.id);
	}

	@Get()
	async listComplaints() {
		return this.complaintService.listComplaints();
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.STAFF, Role.ADMIN)
	async updateComplaint(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateComplaintDto: UpdateComplaintDto,
	) {
		return this.complaintService.updateComplaint(id, updateComplaintDto);
	}
}
