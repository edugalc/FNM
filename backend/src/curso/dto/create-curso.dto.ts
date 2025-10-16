import { IsString, IsNumber, IsOptional, ValidateNested, IsArray, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSeccionDto } from './create-seccion.dto';

export class CreateCursoDto {
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  precio: number;

  @IsOptional()
  @IsUrl()
  imagenUrl?: string; // nueva propiedad para la URL de la imagen

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSeccionDto)
  secciones?: CreateSeccionDto[];
}
