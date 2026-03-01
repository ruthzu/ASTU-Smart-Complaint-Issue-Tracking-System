"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
        const staff = await this.prisma.user.findMany({
            where: { role: 'STAFF' },
            select: { id: true, name: true },
        });
        if (staff.length === 0)
            return [];
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
        const assignedMap = Object.fromEntries(assignedGroups.map((g) => [g.assignedStaffId, g._count._all]));
        const resolvedMap = Object.fromEntries(resolvedGroups.map((g) => [g.assignedStaffId, g._count._all]));
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
        const departmentIds = departmentGroups.map((g) => g.departmentId);
        let departments = [];
        if (departmentIds.length > 0) {
            departments = await this.prisma.department.findMany({
                where: { id: { in: departmentIds } },
                select: { id: true, name: true },
            });
        }
        const departmentMap = Object.fromEntries(departments.map((d) => [d.id, d.name]));
        const resolvedMap = Object.fromEntries(resolvedGroups.map((g) => [g.departmentId, g._count._all]));
        const departmentRates = {};
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
        const categoryCounts = {};
        for (const group of categoryGroups) {
            categoryCounts[group.category] = group._count.category;
        }
        // Group by department (join with department name)
        const departmentGroups = await this.prisma.complaint.groupBy({
            by: ['departmentId'],
            _count: { departmentId: true },
        });
        // Fetch department names
        const departmentIds = departmentGroups.map((g) => g.departmentId).filter((id) => id !== null);
        let departments = [];
        if (departmentIds.length > 0) {
            departments = await this.prisma.department.findMany({
                where: { id: { in: departmentIds } },
                select: { id: true, name: true },
            });
        }
        const departmentMap = Object.fromEntries(departments.map((d) => [d.id, d.name]));
        const departmentCounts = {};
        for (const group of departmentGroups) {
            let name;
            if (typeof group.departmentId === 'number') {
                name = departmentMap[group.departmentId] || 'Unknown';
            }
            else {
                name = 'Unassigned';
            }
            departmentCounts[name] = group._count.departmentId;
        }
        return { categoryCounts, departmentCounts };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map