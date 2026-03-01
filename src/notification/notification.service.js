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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
let NotificationService = NotificationService_1 = class NotificationService {
    prisma;
    emailService;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    /**
     * Create notification and send email for complaint events
     * Example usage for:
     * 1. Complaint created: send to all admins
     * 2. Complaint assigned: send to assigned staff
     * 3. Complaint status updated: send to student
     */
    async createNotification(userId, message, emailOptions) {
        const parsedUserId = Number(userId);
        if (!Number.isInteger(parsedUserId)) {
            throw new common_1.BadRequestException('Invalid userId');
        }
        // Send email if options provided
        if (emailOptions?.to && emailOptions.subject && emailOptions.html) {
            this.emailService.sendMail(emailOptions.to, emailOptions.subject, emailOptions.html)
                .catch(err => this.logger.error(`Failed to send email to ${emailOptions.to}: ${err.message}`));
        }
        return this.prisma.notification.create({
            data: { userId: parsedUserId, message },
        });
    }
    // Example: Send email to all admins when complaint is created
    async notifyAdminsOnComplaintCreated(complaint) {
        const admins = await this.prisma.user.findMany({ where: { role: client_1.Role.ADMIN } });
        await Promise.all(admins.map(admin => this.createNotification(admin.id.toString(), `New complaint submitted: ${complaint.title}`, admin.email ? {
            to: admin.email,
            subject: 'New Complaint Submitted',
            html: `<p>A new complaint was submitted: <b>${complaint.title}</b></p><p>${complaint.description}</p>`
        } : undefined)));
    }
    // Example: Send email to assigned staff when complaint is assigned
    async notifyStaffOnComplaintAssigned(staffId, complaint) {
        const staff = await this.prisma.user.findUnique({ where: { id: staffId } });
        if (staff && staff.email) {
            await this.createNotification(staff.id.toString(), `You have been assigned a complaint: ${complaint.title}`, {
                to: staff.email,
                subject: 'Complaint Assigned',
                html: `<p>You have been assigned a complaint: <b>${complaint.title}</b></p><p>${complaint.description}</p>`
            });
        }
    }
    // Example: Send email to student when complaint status is updated
    async notifyStudentOnStatusUpdate(studentId, complaint) {
        if (complaint.email) {
            await this.createNotification(studentId.toString(), `Your complaint status changed to ${complaint.status}`, {
                to: complaint.email,
                subject: 'Complaint Status Updated',
                html: `<p>Your complaint <b>${complaint.title}</b> status changed to <b>${complaint.status}</b>.</p>`
            });
        }
    }
    async getNotificationsForUser(userId, page = 1, limit = 10, unread) {
        if (page < 1 || limit < 1) {
            throw new common_1.BadRequestException('page and limit must be positive');
        }
        const skip = (page - 1) * limit;
        const where = { userId };
        if (unread === true) {
            where.isRead = false;
        }
        else if (unread === false) {
            where.isRead = true;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.notification.count({ where }),
        ]);
        return { items, total, page, limit };
    }
    async markNotificationAsRead(id, userId) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (notification.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to modify this notification');
        }
        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map