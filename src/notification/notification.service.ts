import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

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

  async getNotificationsForUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
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
