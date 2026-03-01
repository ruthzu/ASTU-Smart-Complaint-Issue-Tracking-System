import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './create-department.dto';
import { UpdateDepartmentDto } from './update-department.dto';
export declare class DepartmentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createDepartmentDto: CreateDepartmentDto): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    update(id: number, updateDepartmentDto: UpdateDepartmentDto): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=department.service.d.ts.map