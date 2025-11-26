import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEbookDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  autor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  precio?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
