import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  titulo: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsNumber()
  orden?: number;
}
