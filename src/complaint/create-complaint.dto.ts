import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsOptional()
  attachment?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}
