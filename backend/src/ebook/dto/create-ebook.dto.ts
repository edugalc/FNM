import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEbookDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  autor?: string;

  @Type(() => Number)
  @IsNumber()
  precio: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
