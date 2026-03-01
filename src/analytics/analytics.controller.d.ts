import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getAllAnalytics(): Promise<{
        totalComplaints: number;
        statusCounts: {
            total: number;
            open: number;
            inProgress: number;
            resolved: number;
        };
        categoryCounts: {
            [key: string]: number;
        };
        departmentCounts: {
            [key: string]: number;
        };
        resolutionRates: {
            overallRate: number;
            departmentRates: {
                [key: string]: number;
            };
        };
        complaintsPerStaff: {
            staffName: string;
            totalAssigned: number;
            resolved: number;
        }[];
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
//# sourceMappingURL=analytics.controller.d.ts.map