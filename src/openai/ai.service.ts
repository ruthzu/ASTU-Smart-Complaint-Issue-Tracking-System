import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }

    this.openai = new OpenAI({ apiKey });
  }

  async askAI(message: string, userId?: number) {
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
    }).catch((err: unknown) => {
      // Map OpenAI quota/rate errors to a clearer HTTP response.
      const message = err instanceof Error ? err.message : 'OpenAI request failed';
      const status = (err as { status?: number })?.status;
      if (status === 429) {
        throw new HttpException('OpenAI rate limit or quota exceeded. Please try again later.', HttpStatus.TOO_MANY_REQUESTS);
      }
      throw new HttpException(message, HttpStatus.BAD_GATEWAY);
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    return content;
  }
}
