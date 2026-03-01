import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './create-complaint.dto';
import { UpdateComplaintDto } from './update-complaint.dto';
import { AssignDepartmentDto } from './assign-department.dto';
import { NotificationService } from '../notification/notification.service';
export declare class ComplaintService {
    private readonly prisma;
    private readonly notificationService;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    createComplaint(createComplaintDto: CreateComplaintDto, userId: number): Promise<{
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
    listComplaintsPaginated(page: number, limit: number): Promise<{
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
    listComplaintsForUser(currentUser: {
        id: number;
        role: Role;
    }, departmentId?: number): Promise<{
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
    updateComplaint(id: number, updateComplaintDto: UpdateComplaintDto, currentUser: {
        id: number;
        role: Role;
    }): Promise<{
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
//# sourceMappingURL=complaint.service.d.ts.map