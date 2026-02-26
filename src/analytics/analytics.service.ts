  // Get complaint counts grouped by category and department
  async getComplaintsByCategoryOrDepartment() {
    // Group by category
    const categoryGroups = await this.prisma.complaint.groupBy({
      by: ['category'],
      _count: { category: true },
    });
    const categoryCounts: { [key: string]: number } = {};
    for (const group of categoryGroups) {
      categoryCounts[group.category] = group._count.category;
    }

    // Group by department (join with department name)
    const departmentGroups = await this.prisma.complaint.groupBy({
      by: ['departmentId'],
      _count: { departmentId: true },
    });
    // Fetch department names
    const departmentIds = departmentGroups.map(g => g.departmentId).filter(id => id !== null);
    let departments: { id: number, name: string }[] = [];
    if (departmentIds.length > 0) {
      departments = await this.prisma.department.findMany({
        where: { id: { in: departmentIds } },
        select: { id: true, name: true },
      });
    }
    const departmentMap = Object.fromEntries(departments.map(d => [d.id, d.name]));
    const departmentCounts: { [key: string]: number } = {};
    for (const group of departmentGroups) {
      const name = group.departmentId ? departmentMap[group.departmentId] : 'Unassigned';
      departmentCounts[name] = group._count.departmentId;
    }

    return { categoryCounts, departmentCounts };
  }
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
