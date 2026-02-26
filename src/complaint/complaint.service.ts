import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ComplaintStatus, Role } from '@prisma/client';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './create-complaint.dto';
import { UpdateComplaintDto } from './update-complaint.dto';
import { AssignDepartmentDto } from './assign-department.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ComplaintService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly notificationService: NotificationService,
	) {}

	async createComplaint(createComplaintDto: CreateComplaintDto, userId: number) {
		const complaint = await this.prisma.complaint.create({
			data: {
				...createComplaintDto,
				userId,
				status: ComplaintStatus.OPEN,
				remarks: createComplaintDto.remarks ?? null,
				attachment: createComplaintDto.attachment ?? null,
			},
		});

		const admins = await this.prisma.user.findMany({
			where: { role: Role.ADMIN },
			select: { id: true },
		});

		await Promise.all(
			admins.map((admin) =>
				this.notificationService.createNotification(
					admin.id.toString(),
					`New complaint submitted: ${complaint.title}`,
				),
			),
		);

		return complaint;
	}

	async listComplaintsPaginated(page: number, limit: number) {
		const skip = (page - 1) * limit;
		const [items, total] = await Promise.all([
			this.prisma.complaint.findMany({ skip, take: limit }),
			this.prisma.complaint.count(),
		]);
		return {
			items,
			total,
			page,
			limit,
			pageCount: Math.ceil(total / limit),
		};
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
			select: { assignedStaffId: true, status: true, userId: true, title: true },
		});
		if (!complaint) {
			throw new NotFoundException('Complaint not found');
		}

		if (currentUser.role === Role.STAFF) {
			if (complaint.assignedStaffId !== currentUser.id) {
				throw new ForbiddenException('Not assigned to this complaint');
			}
		}

		const updatedComplaint = await this.prisma.complaint.update({
			where: { id },
			data: updateComplaintDto,
		});

		const notifications: Array<Promise<unknown>> = [];

		if (
			updateComplaintDto.assignedStaffId !== undefined &&
			updateComplaintDto.assignedStaffId !== complaint.assignedStaffId &&
			updateComplaintDto.assignedStaffId !== null
		) {
			notifications.push(
				this.notificationService.createNotification(
					updateComplaintDto.assignedStaffId.toString(),
					`You have been assigned a complaint: ${complaint.title}`,
				),
			);
		}

		if (
			updateComplaintDto.status !== undefined &&
			updateComplaintDto.status !== complaint.status
		) {
			notifications.push(
				this.notificationService.createNotification(
					complaint.userId.toString(),
					`Your complaint status changed to ${updateComplaintDto.status}`,
				),
			);
		}

		await Promise.all(notifications);

		return updatedComplaint;
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
