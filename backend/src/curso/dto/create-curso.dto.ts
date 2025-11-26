import { IsString, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSeccionDto } from './create-seccion.dto';

export class CreateCursoDto {
  @IsString()
  titulo!: string;

  @IsString()
  descripcion!: string;

  @IsOptional()
  @IsNumber()
  precio?: number = 0;

  @IsOptional()
  @IsString()
  imagenUrl?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSeccionDto)
  secciones?: CreateSeccionDto[] = [];
}
