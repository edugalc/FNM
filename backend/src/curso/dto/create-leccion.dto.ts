import { IsString, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVideoDto } from './create-video.dto';
import { CreateCuestionarioDto } from './create-cuestionario.dto';

export class CreateLeccionDto {
  @IsString()
  titulo!: string;

  @IsOptional()
  @IsString()
  contenido?: string | null;

  @IsOptional()
  @IsNumber()
  orden?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVideoDto)
  videos?: CreateVideoDto[] = [];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCuestionarioDto)
  cuestionario?: CreateCuestionarioDto | null;
}
