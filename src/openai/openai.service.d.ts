import OpenAI from 'openai';
export declare class OpenAIService {
    private readonly client;
    constructor();
    getClient(): OpenAI;
    askAI(message: string): Promise<"You can submit a complaint via the ASTU portal under Complaints section." | "You can check your complaint status in your dashboard under Complaints." | "Please submit a complaint to the Facilities department about your dorm." | "I am only able to answer ASTU campus-related questions.">;
}
//# sourceMappingURL=openai.service.d.ts.map