import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set. Add it to your environment to enable OpenAI.');
    }

    this.client = new OpenAI({ apiKey });
  }

  getClient(): OpenAI {
    return this.client;
  }
}
