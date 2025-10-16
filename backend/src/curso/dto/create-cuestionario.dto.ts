import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePreguntaDto } from './create-pregunta.dto';

export class CreateCuestionarioDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePreguntaDto)
  preguntas: CreatePreguntaDto[];
}
