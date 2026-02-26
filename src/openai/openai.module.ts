import { Global, Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { AiService } from './ai.service';
import { ChatbotController } from './chatbot.controller';
import { PrismaService } from '../prisma/prisma.service';

@Global()
@Module({
  controllers: [ChatbotController],
  providers: [OpenAIService, AiService, PrismaService],
  exports: [OpenAIService, AiService],
})
export class OpenAIModule {}
