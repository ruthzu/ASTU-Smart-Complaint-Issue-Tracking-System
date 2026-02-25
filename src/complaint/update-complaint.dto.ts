import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ComplaintStatus } from '@prisma/client';

export class UpdateComplaintDto {
  @IsEnum(ComplaintStatus)
  status!: ComplaintStatus;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  remarks?: string;

  @IsString()
  @IsOptional()
  attachment?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  assignedStaffId?: number;
}
