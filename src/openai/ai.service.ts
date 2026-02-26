import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }

    this.openai = new OpenAI({ apiKey });
  }

  async askAI(message: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant for ASTU Smart Complaint System. Help students with campus issues, complaint submission guidance, and ticket status understanding.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.4,
    });

    return response.choices[0].message.content;
  }
}
