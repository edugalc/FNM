import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateVideoDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsNumber()
  orden?: number;
}
