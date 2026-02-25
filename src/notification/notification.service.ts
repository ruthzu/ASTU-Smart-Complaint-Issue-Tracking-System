import { BadRequestException, Injectable } from '@nestjs/common';

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
}
