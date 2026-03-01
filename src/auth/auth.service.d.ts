import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: number;
        name: string;
        email: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map