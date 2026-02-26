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

  // Get complaint counts by status
  async getComplaintStatusCounts() {
    const [total, open, inProgress, resolved] = await Promise.all([
      this.prisma.complaint.count(),
      this.prisma.complaint.count({ where: { status: 'OPEN' } }),
      this.prisma.complaint.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.complaint.count({ where: { status: 'RESOLVED' } }),
    ]);
    return {
      total,
      open,
      inProgress,
      resolved,
    };
  }

  // Add more analytics methods as needed
}
