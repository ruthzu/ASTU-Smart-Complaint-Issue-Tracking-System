import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: number;
        name: string;
        email: string;
    }[]>;
    updateRole(id: number, role: Role): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: number;
        name: string;
        email: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=user.service.d.ts.map