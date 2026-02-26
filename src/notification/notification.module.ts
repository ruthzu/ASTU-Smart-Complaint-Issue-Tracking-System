import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';

import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [EmailModule],
  controllers: [NotificationController],
  providers: [NotificationService, PrismaService],
  exports: [NotificationService],
})
export class NotificationModule {}
