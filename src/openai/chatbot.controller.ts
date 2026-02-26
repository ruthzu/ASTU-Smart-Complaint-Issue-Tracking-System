import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AiService } from './ai.service';
import { ChatbotMessageDto } from './chatbot-message.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  async askChatbot(@Body() body: ChatbotMessageDto, @Req() req: Request) {
    const user = req.user as { id?: number } | undefined;
    const reply = await this.aiService.askAI(body.message, user?.id);
    return { response: reply };
  }
}
