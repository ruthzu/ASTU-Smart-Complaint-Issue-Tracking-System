import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { ComplaintController } from './complaint.controller';
import { ComplaintService } from './complaint.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [MulterModule.register({ dest: './uploads' }), NotificationModule],
  controllers: [ComplaintController],
  providers: [ComplaintService, PrismaService],
})
export class ComplaintModule {}
