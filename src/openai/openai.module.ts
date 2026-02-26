import { Global, Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { AiService } from './ai.service';

@Global()
@Module({
  providers: [OpenAIService, AiService],
  exports: [OpenAIService, AiService],
})
export class OpenAIModule {}
