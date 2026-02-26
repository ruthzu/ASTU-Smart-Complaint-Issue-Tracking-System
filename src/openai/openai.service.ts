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


async askAI(message: string) {
  // Mock responses for testing Phase 6
  if (message.toLowerCase().includes("complaint")) {
    return "You can submit a complaint via the ASTU portal under Complaints section.";
  }
  if (message.toLowerCase().includes("status")) {
    return "You can check your complaint status in your dashboard under Complaints.";
  }
  if (message.toLowerCase().includes("dorm")) {
    return "Please submit a complaint to the Facilities department about your dorm.";
  }
  // Refuse unrelated
  return "I am only able to answer ASTU campus-related questions.";
}
}
