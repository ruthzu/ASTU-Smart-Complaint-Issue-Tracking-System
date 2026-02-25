import { Injectable } from '@nestjs/common';
import { ComplaintStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './create-complaint.dto';

@Injectable()
export class ComplaintService {
	constructor(private readonly prisma: PrismaService) {}

	async createComplaint(createComplaintDto: CreateComplaintDto, userId: number) {
		return this.prisma.complaint.create({
			data: {
				...createComplaintDto,
				userId,
				status: ComplaintStatus.OPEN,
				remarks: '',
			},
		});
	}

	async listComplaints() {
		return this.prisma.complaint.findMany();
	}
}
