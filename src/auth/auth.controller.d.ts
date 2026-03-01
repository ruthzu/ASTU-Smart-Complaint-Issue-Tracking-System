import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: number;
        name: string;
        email: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    getProfile(req: {
        user: unknown;
    }): unknown;
    getAdminOnly(): {
        ok: boolean;
    };
}
//# sourceMappingURL=auth.controller.d.ts.map