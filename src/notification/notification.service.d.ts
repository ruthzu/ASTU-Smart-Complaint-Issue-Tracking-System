import { ComplaintStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
export declare class NotificationService {
    private readonly prisma;
    private readonly emailService;
    private readonly logger;
    constructor(prisma: PrismaService, emailService: EmailService);
    /**
     * Create notification and send email for complaint events
     * Example usage for:
     * 1. Complaint created: send to all admins
     * 2. Complaint assigned: send to assigned staff
     * 3. Complaint status updated: send to student
     */
    createNotification(userId: string, message: string, emailOptions?: {
        to?: string;
        subject?: string;
        html?: string;
    }): Promise<{
        id: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
        userId: number;
    }>;
    notifyAdminsOnComplaintCreated(complaint: {
        title: string;
        description: string;
    }): Promise<void>;
    notifyStaffOnComplaintAssigned(staffId: number, complaint: {
        title: string;
        description: string;
    }): Promise<void>;
    notifyStudentOnStatusUpdate(studentId: number, complaint: {
        title: string;
        status: ComplaintStatus;
        email: string;
    }): Promise<void>;
    getNotificationsForUser(userId: number, page?: number, limit?: number, unread?: boolean): Promise<{
        items: {
            id: string;
            message: string;
            isRead: boolean;
            createdAt: Date;
            userId: number;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    markNotificationAsRead(id: string, userId: number): Promise<{
        id: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
        userId: number;
    }>;
}
//# sourceMappingURL=notification.service.d.ts.map