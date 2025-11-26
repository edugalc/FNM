import { IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdatePreguntaDto } from './update-pregunta.dto';

export class UpdateCuestionarioDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePreguntaDto)
  preguntas?: UpdatePreguntaDto[] | any[];
}
