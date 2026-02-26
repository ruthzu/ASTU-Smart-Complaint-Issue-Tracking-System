import { Body, Controller, Post, UseGuards } from '@nestjs/common';

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
  async askChatbot(@Body() body: ChatbotMessageDto) {
    const reply = await this.aiService.askAI(body.message);
    return { response: reply };
  }
}
