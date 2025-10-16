import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateCursoDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  precio?: number;
}
