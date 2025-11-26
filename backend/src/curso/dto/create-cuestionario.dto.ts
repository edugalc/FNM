import { IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePreguntaDto } from './create-pregunta.dto';

export class CreateCuestionarioDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePreguntaDto)
  preguntas?: CreatePreguntaDto[] = [];
}
