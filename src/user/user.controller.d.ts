import { UpdateUserRoleDto } from './update-user-role.dto';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: number;
        name: string;
        email: string;
    }[]>;
    updateRole(id: number, updateUserRoleDto: UpdateUserRoleDto): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: number;
        name: string;
        email: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=user.controller.d.ts.map