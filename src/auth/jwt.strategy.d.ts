import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
interface JwtPayload {
    sub: number;
    email: string;
    role: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: number;
        name: string;
        email: string;
    }>;
}
export {};
//# sourceMappingURL=jwt.strategy.d.ts.map