import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  // Example: Get total counts for admin dashboard
  async getCounts() {
    const [complaints, departments, users] = await Promise.all([
      this.prisma.complaint.count(),
      this.prisma.department.count(),
      this.prisma.user.count(),
    ]);
    return { complaints, departments, users };
  }

  // Add more analytics methods as needed
}
