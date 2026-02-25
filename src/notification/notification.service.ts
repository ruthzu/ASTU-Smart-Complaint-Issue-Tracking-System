import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(userId: string, message: string) {
    const parsedUserId = Number(userId);
    if (!Number.isInteger(parsedUserId)) {
      throw new BadRequestException('Invalid userId');
    }

    return this.prisma.notification.create({
      data: { userId: parsedUserId, message },
    });
  }

  async getNotificationsForUser(userId: number, page = 1, limit = 10, unread?: boolean) {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('page and limit must be positive');
    }

    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = { userId };
    if (unread === true) {
      where.isRead = false;
    } else if (unread === false) {
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

  async markNotificationAsRead(id: string, userId: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Not authorized to modify this notification');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
