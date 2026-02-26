import { IsNotEmpty, IsString } from 'class-validator';

export class ChatbotMessageDto {
  @IsString()
  @IsNotEmpty()
  message!: string;
}
