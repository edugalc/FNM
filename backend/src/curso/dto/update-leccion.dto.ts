import { IsOptional, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateVideoDto } from './update-video.dto';
import { UpdateCuestionarioDto } from './update-cuestionario.dto';

export class UpdateLeccionDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  contenido?: string | null;

  @IsOptional()
  @IsNumber()
  orden?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVideoDto)
  videos?: UpdateVideoDto[] | any[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCuestionarioDto)
  cuestionario?: UpdateCuestionarioDto | null;
}
