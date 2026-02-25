import { Controller, Get, Patch, Param, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async listNotifications(@Req() request: Request) {
    const user = request.user as { id?: number } | undefined;
    if (!user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.notificationService.getNotificationsForUser(user.id);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Param('id') id: string, @Req() request: Request) {
    const user = request.user as { id?: number } | undefined;
    if (!user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.notificationService.markNotificationAsRead(id, user.id);
  }
}
