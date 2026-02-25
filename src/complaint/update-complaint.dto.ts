import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ComplaintStatus } from '@prisma/client';

export class UpdateComplaintDto {
  @IsEnum(ComplaintStatus)
  status!: ComplaintStatus;

  @IsString()
  @IsNotEmpty()
  remarks!: string;

  @IsString()
  @IsOptional()
  attachment?: string;
}
