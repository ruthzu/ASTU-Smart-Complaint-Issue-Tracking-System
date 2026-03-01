import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly configService;
    private readonly transporter;
    private readonly from;
    private readonly logger;
    constructor(configService: ConfigService);
    sendMail(to: string, subject: string, html: string): Promise<void>;
}
//# sourceMappingURL=email.service.d.ts.map