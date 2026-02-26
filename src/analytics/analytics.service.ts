      // Get complaints assigned and resolved per staff member
      async getComplaintsPerStaff() {
        // Get all staff users
        const staff = await this.prisma.user.findMany({
          where: { role: 'STAFF' },
          select: { id: true, name: true },
        });
        if (staff.length === 0) return [];

        // Get assigned complaints grouped by staff
        const assignedGroups = await this.prisma.complaint.groupBy({
          by: ['assignedStaffId'],
          _count: { _all: true },
          where: { assignedStaffId: { in: staff.map(s => s.id) } },
        });
        const resolvedGroups = await this.prisma.complaint.groupBy({
          by: ['assignedStaffId'],
          _count: { _all: true },
          where: { assignedStaffId: { in: staff.map(s => s.id) }, status: 'RESOLVED' },
        });
        const assignedMap = Object.fromEntries(assignedGroups.map(g => [g.assignedStaffId, g._count._all]));
        const resolvedMap = Object.fromEntries(resolvedGroups.map(g => [g.assignedStaffId, g._count._all]));

        return staff.map(s => ({
          staffName: s.name,
          totalAssigned: assignedMap[s.id] || 0,
          resolved: resolvedMap[s.id] || 0,
        }));
      }
    // Get overall and per-department resolution rates
    async getResolutionRate() {
      // Overall counts
      const [total, resolved] = await Promise.all([
        this.prisma.complaint.count(),
        this.prisma.complaint.count({ where: { status: 'RESOLVED' } }),
      ]);
      const overallRate = total > 0 ? (resolved / total) * 100 : 0;

      // Per-department counts
      const departmentGroups = await this.prisma.complaint.groupBy({
        by: ['departmentId'],
        _count: { _all: true },
        where: { departmentId: { not: null } },
      });
      const resolvedGroups = await this.prisma.complaint.groupBy({
        by: ['departmentId'],
        _count: { _all: true },
        where: { status: 'RESOLVED', departmentId: { not: null } },
      });
      const departmentIds = departmentGroups.map(g => g.departmentId);
      let departments: { id: number, name: string }[] = [];
      if (departmentIds.length > 0) {
        departments = await this.prisma.department.findMany({
          where: { id: { in: departmentIds } },
          select: { id: true, name: true },
        });
      }
      const departmentMap = Object.fromEntries(departments.map(d => [d.id, d.name]));
      const resolvedMap = Object.fromEntries(resolvedGroups.map(g => [g.departmentId, g._count._all]));
      const departmentRates: { [key: string]: number } = {};
      for (const group of departmentGroups) {
        const name = departmentMap[group.departmentId] || 'Unknown';
        const deptTotal = group._count._all;
        const deptResolved = resolvedMap[group.departmentId] || 0;
        departmentRates[name] = deptTotal > 0 ? (deptResolved / deptTotal) * 100 : 0;
      }

      return { overallRate, departmentRates };
    }
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
