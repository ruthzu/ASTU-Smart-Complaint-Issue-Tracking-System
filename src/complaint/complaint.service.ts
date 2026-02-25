import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ComplaintStatus, Role } from '@prisma/client';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './create-complaint.dto';
import { UpdateComplaintDto } from './update-complaint.dto';
import { AssignDepartmentDto } from './assign-department.dto';

@Injectable()
export class ComplaintService {
	constructor(private readonly prisma: PrismaService) {}

	async createComplaint(createComplaintDto: CreateComplaintDto, userId: number) {
		return this.prisma.complaint.create({
			data: {
				...createComplaintDto,
				userId,
				status: ComplaintStatus.OPEN,
				remarks: createComplaintDto.remarks ?? null,
				attachment: createComplaintDto.attachment ?? null,
			},
		});
	}

	async listComplaints() {
		return this.prisma.complaint.findMany();
	}

	async listComplaintsForUser(
		currentUser: { id: number; role: Role },
		departmentId?: number,
	) {
		const where: Prisma.ComplaintWhereInput = {};
		if (departmentId) {
			where.departmentId = departmentId;
		}

		if (currentUser.role === Role.STAFF) {
			where.assignedStaffId = currentUser.id;
		}

		return this.prisma.complaint.findMany({ where });
	}

	async updateComplaint(
		id: number,
		updateComplaintDto: UpdateComplaintDto,
		currentUser: { id: number; role: Role },
	) {
		const complaint = await this.prisma.complaint.findUnique({
			where: { id },
			select: { assignedStaffId: true },
		});
		if (!complaint) {
			throw new NotFoundException('Complaint not found');
		}

		if (currentUser.role === Role.STAFF) {
			if (complaint.assignedStaffId !== currentUser.id) {
				throw new ForbiddenException('Not assigned to this complaint');
			}
		}

		return this.prisma.complaint.update({
			where: { id },
			data: updateComplaintDto,
		});
	}

	async assignDepartment(id: number, assignDepartmentDto: AssignDepartmentDto) {
		try {
			return await this.prisma.complaint.update({
				where: { id },
				data: { departmentId: assignDepartmentDto.departmentId },
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				throw new NotFoundException('Complaint not found');
			}
			throw error;
		}
	}
}
