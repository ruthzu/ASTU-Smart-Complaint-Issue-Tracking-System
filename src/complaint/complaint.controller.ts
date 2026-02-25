import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateComplaintDto } from './create-complaint.dto';
import { ComplaintService } from './complaint.service';

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
}
