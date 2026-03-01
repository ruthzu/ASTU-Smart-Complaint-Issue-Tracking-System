"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
const prisma_service_1 = require("../prisma/prisma.service");
let AiService = class AiService {
    configService;
    prisma;
    openai;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY is not defined');
        }
        this.openai = new openai_1.default({ apiKey });
    }
    async askAI(message, userId) {
        const baseSystemPrompt = [
            'You are an assistant for ASTU Smart Complaint System.',
            'Help students with campus issues, complaint submission guidance, and ticket status understanding.',
            'Only answer questions related to ASTU campus issues; if a question is unrelated, politely refuse.',
            'Do not provide medical, legal, or financial advice.',
            'Keep answers concise and helpful.',
        ].join(' ');
        let complaintContext = '';
        if (userId) {
            const complaints = await this.prisma.complaint.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: { title: true, status: true },
            });
            if (complaints.length > 0) {
                const items = complaints
                    .map((c) => `- Title: ${c.title}, Status: ${c.status}`)
                    .join('\n');
                complaintContext = `\n\nRecent complaints:\n${items}`;
            }
        }
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `${baseSystemPrompt}${complaintContext}`,
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
            temperature: 0.4,
        }).catch((err) => {
            // Map OpenAI quota/rate errors to a clearer HTTP response.
            const message = err instanceof Error ? err.message : 'OpenAI request failed';
            const status = err?.status;
            if (status === 429) {
                throw new common_1.HttpException('OpenAI rate limit or quota exceeded. Please try again later.', common_1.HttpStatus.TOO_MANY_REQUESTS);
            }
            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_GATEWAY);
        });
        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response content from OpenAI');
        }
        return content;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map