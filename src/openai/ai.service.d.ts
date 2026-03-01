import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class AiService {
    private readonly configService;
    private readonly prisma;
    private openai;
    constructor(configService: ConfigService, prisma: PrismaService);
    askAI(message: string, userId?: number): Promise<string>;
}
//# sourceMappingURL=ai.service.d.ts.map