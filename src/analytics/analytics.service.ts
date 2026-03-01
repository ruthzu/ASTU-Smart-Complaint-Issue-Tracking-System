
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

        // Get complaints assigned and resolved per staff member
        async getComplaintsPerStaff() {
          const staff: { id: number; name: string }[] = await this.prisma.user.findMany({
            where: { role: 'STAFF' },
            select: { id: true, name: true },
          });
          if (staff.length === 0) return [];

          const assignedGroups = await this.prisma.complaint.groupBy({
            by: ['assignedStaffId'],
            _count: { _all: true },
            where: { assignedStaffId: { in: staff.map((s) => s.id) } },
          });
          const resolvedGroups = await this.prisma.complaint.groupBy({
            by: ['assignedStaffId'],
            _count: { _all: true },
            where: { assignedStaffId: { in: staff.map((s) => s.id) }, status: 'RESOLVED' },
          });
          const assignedMap: Record<number, number> = Object.fromEntries(assignedGroups.map((g: any) => [g.assignedStaffId, g._count._all]));
          const resolvedMap: Record<number, number> = Object.fromEntries(resolvedGroups.map((g: any) => [g.assignedStaffId, g._count._all]));

          return staff.map((s) => ({
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
          const departmentIds = departmentGroups.map((g: any) => g.departmentId);
          let departments: { id: number; name: string }[] = [];
          if (departmentIds.length > 0) {
            departments = await this.prisma.department.findMany({
              where: { id: { in: departmentIds } },
              select: { id: true, name: true },
            });
          }
          const departmentMap: Record<number, string> = Object.fromEntries(departments.map((d) => [d.id, d.name]));
          const resolvedMap: Record<number, number> = Object.fromEntries(resolvedGroups.map((g: any) => [g.departmentId, g._count._all]));
          const departmentRates: { [key: string]: number } = {};
          for (const group of departmentGroups) {
            const deptId = group.departmentId;
            const name = deptId !== null ? departmentMap[deptId] : 'Unknown';
            const deptTotal = group._count._all;
            const deptResolved = deptId !== null ? resolvedMap[deptId] || 0 : 0;
            departmentRates[String(name)] = deptTotal > 0 ? (deptResolved / deptTotal) * 100 : 0;
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
          const departmentIds = departmentGroups.map((g: any) => g.departmentId).filter((id: number | null) => id !== null);
          let departments: { id: number; name: string }[] = [];
          if (departmentIds.length > 0) {
            departments = await this.prisma.department.findMany({
              where: { id: { in: departmentIds } },
              select: { id: true, name: true },
            });
          }
          const departmentMap: Record<number, string> = Object.fromEntries(departments.map((d) => [d.id, d.name]));
          const departmentCounts: { [key: string]: number } = {};
          for (const group of departmentGroups) {
            let name: string;
            if (typeof group.departmentId === 'number') {
              name = departmentMap[group.departmentId] || 'Unknown';
            } else {
              name = 'Unassigned';
            }
            departmentCounts[name] = group._count.departmentId;
          }

          return { categoryCounts, departmentCounts };
        }

        // Add more analytics methods as needed
      }
