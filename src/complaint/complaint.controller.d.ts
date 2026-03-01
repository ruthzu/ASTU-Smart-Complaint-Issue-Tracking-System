import type { Request } from 'express';
import { CreateComplaintDto } from './create-complaint.dto';
import { AssignDepartmentDto } from './assign-department.dto';
import { ComplaintService } from './complaint.service';
import { UpdateComplaintDto } from './update-complaint.dto';
export declare class ComplaintController {
    private readonly complaintService;
    constructor(complaintService: ComplaintService);
    createComplaint(createComplaintDto: CreateComplaintDto, file: Express.Multer.File | undefined, request: Request): Promise<{
        id: number;
        title: string;
        description: string;
        category: string;
        attachment: string | null;
        remarks: string | null;
        departmentId: number | null;
        status: import(".prisma/client").$Enums.ComplaintStatus;
        assignedStaffId: number | null;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
    }>;
    listComplaints(page?: string, limit?: string): Promise<{
        items: {
            id: number;
            title: string;
            description: string;
            category: string;
            attachment: string | null;
            remarks: string | null;
            departmentId: number | null;
            status: import(".prisma/client").$Enums.ComplaintStatus;
            assignedStaffId: number | null;
            createdAt: Date;
            userId: number;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        pageCount: number;
    }>;
    listComplaintsForStaff(request: Request, departmentId?: string): Promise<{
        id: number;
        title: string;
        description: string;
        category: string;
        attachment: string | null;
        remarks: string | null;
        departmentId: number | null;
        status: import(".prisma/client").$Enums.ComplaintStatus;
        assignedStaffId: number | null;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
    }[]>;
    updateComplaint(id: number, updateComplaintDto: UpdateComplaintDto, request: Request): Promise<{
        id: number;
        title: string;
        description: string;
        category: string;
        attachment: string | null;
        remarks: string | null;
        departmentId: number | null;
        status: import(".prisma/client").$Enums.ComplaintStatus;
        assignedStaffId: number | null;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
    }>;
    assignDepartment(id: number, assignDepartmentDto: AssignDepartmentDto): Promise<{
        id: number;
        title: string;
        description: string;
        category: string;
        attachment: string | null;
        remarks: string | null;
        departmentId: number | null;
        status: import(".prisma/client").$Enums.ComplaintStatus;
        assignedStaffId: number | null;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=complaint.controller.d.ts.map