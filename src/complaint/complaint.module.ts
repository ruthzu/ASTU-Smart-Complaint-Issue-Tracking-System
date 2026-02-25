import { Module } from '@nestjs/common';

import { ComplaintController } from './complaint.controller';
import { ComplaintService } from './complaint.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ComplaintController],
  providers: [ComplaintService, PrismaService],
})
export class ComplaintModule {}
