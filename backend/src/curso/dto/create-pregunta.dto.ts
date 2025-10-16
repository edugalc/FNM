import { IsString, IsOptional, IsEnum, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoPregunta } from '@prisma/client';
import { CreateOpcionDto } from './create-opcion.dto';

export class CreatePreguntaDto {
  @IsString()
  texto: string;

  @IsEnum(TipoPregunta)
  tipo: TipoPregunta;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOpcionDto)
  opciones?: CreateOpcionDto[];

  @IsOptional()
  @IsString()
  respuestaCorrecta?: string;
}
