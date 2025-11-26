import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOpcionDto } from './create-opcion.dto';

export class CreatePreguntaDto {
  @IsString()
  texto!: string;

  @IsOptional()
  @IsString()
  tipo?: string = 'OPCION_MULTIPLE';

  @IsOptional()
  @IsString()
  respuestaCorrecta?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOpcionDto)
  opciones?: CreateOpcionDto[] = [];
}
