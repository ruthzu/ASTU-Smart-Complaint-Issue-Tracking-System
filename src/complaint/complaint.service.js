"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("../notification/notification.service");
let ComplaintService = class ComplaintService {
    prisma;
    notificationService;
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async createComplaint(createComplaintDto, userId) {
        const complaint = await this.prisma.complaint.create({
            data: {
                ...createComplaintDto,
                userId,
                status: client_1.ComplaintStatus.OPEN,
                remarks: createComplaintDto.remarks ?? null,
                attachment: createComplaintDto.attachment ?? null,
            },
        });
        // Notify all admins (in-app + email)
        await this.notificationService.notifyAdminsOnComplaintCreated({
            title: complaint.title,
            description: complaint.description,
        });
        return complaint;
    }
    async listComplaintsPaginated(page, limit) {
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
    async listComplaintsForUser(currentUser, departmentId) {
        const where = {};
        if (departmentId) {
            where.departmentId = departmentId;
        }
        if (currentUser.role === client_1.Role.STAFF) {
            where.assignedStaffId = currentUser.id;
        }
        return this.prisma.complaint.findMany({ where });
    }
    async updateComplaint(id, updateComplaintDto, currentUser) {
        const complaint = await this.prisma.complaint.findUnique({
            where: { id },
            select: { assignedStaffId: true, status: true, userId: true, title: true },
        });
        if (!complaint) {
            throw new common_1.NotFoundException('Complaint not found');
        }
        if (currentUser.role === client_1.Role.STAFF) {
            if (complaint.assignedStaffId !== currentUser.id) {
                throw new common_1.ForbiddenException('Not assigned to this complaint');
            }
        }
        const updatedComplaint = await this.prisma.complaint.update({
            where: { id },
            data: updateComplaintDto,
        });
        const notifications = [];
        if (updateComplaintDto.assignedStaffId !== undefined &&
            updateComplaintDto.assignedStaffId !== complaint.assignedStaffId &&
            updateComplaintDto.assignedStaffId !== null) {
            // Notify assigned staff (in-app + email)
            // Use complaint description from DB, since UpdateComplaintDto does not have description
            const dbComplaint = await this.prisma.complaint.findUnique({ where: { id } });
            notifications.push(this.notificationService.notifyStaffOnComplaintAssigned(updateComplaintDto.assignedStaffId, { title: complaint.title, description: dbComplaint?.description ?? '' }));
        }
        if (updateComplaintDto.status !== undefined &&
            updateComplaintDto.status !== complaint.status) {
            // Notify student (in-app + email)
            const student = await this.prisma.user.findUnique({ where: { id: complaint.userId } });
            notifications.push(this.notificationService.notifyStudentOnStatusUpdate(complaint.userId, {
                title: complaint.title,
                status: updateComplaintDto.status,
                email: student?.email || '',
            }));
        }
        await Promise.all(notifications);
        return updatedComplaint;
    }
    async assignDepartment(id, assignDepartmentDto) {
        try {
            return await this.prisma.complaint.update({
                where: { id },
                data: { departmentId: assignDepartmentDto.departmentId },
            });
        }
        catch (error) {
            if (error instanceof client_2.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.NotFoundException('Complaint not found');
            }
            throw error;
        }
    }
};
exports.ComplaintService = ComplaintService;
exports.ComplaintService = ComplaintService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], ComplaintService);
//# sourceMappingURL=complaint.service.js.map