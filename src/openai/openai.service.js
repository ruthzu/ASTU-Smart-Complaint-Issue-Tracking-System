"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
let OpenAIService = class OpenAIService {
    client;
    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY is not set. Add it to your environment to enable OpenAI.');
        }
        this.client = new openai_1.default({ apiKey });
    }
    getClient() {
        return this.client;
    }
    async askAI(message) {
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
};
exports.OpenAIService = OpenAIService;
exports.OpenAIService = OpenAIService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OpenAIService);
//# sourceMappingURL=openai.service.js.map