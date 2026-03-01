import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCounts(): Promise<{
        complaints: number;
        departments: number;
        users: number;
    }>;
    getComplaintStatusCounts(): Promise<{
        total: number;
        open: number;
        inProgress: number;
        resolved: number;
    }>;
    getComplaintsPerStaff(): Promise<{
        staffName: string;
        totalAssigned: number;
        resolved: number;
    }[]>;
    getResolutionRate(): Promise<{
        overallRate: number;
        departmentRates: {
            [key: string]: number;
        };
    }>;
    getComplaintsByCategoryOrDepartment(): Promise<{
        categoryCounts: {
            [key: string]: number;
        };
        departmentCounts: {
            [key: string]: number;
        };
    }>;
}
//# sourceMappingURL=analytics.service.d.ts.map