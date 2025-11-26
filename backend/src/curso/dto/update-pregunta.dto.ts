import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateOpcionDto } from './update-opcion.dto';

export class UpdatePreguntaDto {
  @IsOptional()
  @IsString()
  texto?: string;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  respuestaCorrecta?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOpcionDto)
  opciones?: UpdateOpcionDto[] | any[];
}
