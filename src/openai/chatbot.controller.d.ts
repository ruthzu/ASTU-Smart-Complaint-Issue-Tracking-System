import type { Request } from 'express';
import { AiService } from './ai.service';
import { ChatbotMessageDto } from './chatbot-message.dto';
export declare class ChatbotController {
    private readonly aiService;
    constructor(aiService: AiService);
    askChatbot(body: ChatbotMessageDto, req: Request): Promise<{
        response: string;
    }>;
}
//# sourceMappingURL=chatbot.controller.d.ts.map