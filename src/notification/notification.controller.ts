import { BadRequestException, Controller, Get, Patch, Param, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async listNotifications(
    @Req() request: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('unread') unread?: string,
  ) {
    const user = request.user as { id?: number } | undefined;
    if (!user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;

    if (!Number.isInteger(pageNum) || pageNum < 1) {
      throw new BadRequestException('page must be a positive integer');
    }
    if (!Number.isInteger(limitNum) || limitNum < 1) {
      throw new BadRequestException('limit must be a positive integer');
    }

    let unreadFlag: boolean | undefined;
    if (unread !== undefined) {
      if (unread === 'true') {
        unreadFlag = true;
      } else if (unread === 'false') {
        unreadFlag = false;
      } else {
        throw new BadRequestException('unread must be true or false');
      }
    }

    const result = await this.notificationService.getNotificationsForUser(
      user.id,
      pageNum,
      limitNum,
      unreadFlag,
    );

    return {
      total: result.total,
      page: result.page,
      limit: result.limit,
      items: result.items,
    };
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
