import type { Request } from 'express';
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    listNotifications(request: Request, page?: string, limit?: string, unread?: string): Promise<{
        total: number;
        page: number;
        limit: number;
        items: {
            id: string;
            message: string;
            isRead: boolean;
            createdAt: Date;
            userId: number;
        }[];
    }>;
    markAsRead(id: string, request: Request): Promise<{
        id: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
        userId: number;
    }>;
}
//# sourceMappingURL=notification.controller.d.ts.map