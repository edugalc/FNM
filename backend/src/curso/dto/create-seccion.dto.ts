import { IsString, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLeccionDto } from './create-leccion.dto';

export class CreateSeccionDto {
  @IsString()
  titulo!: string;

  @IsOptional()
  @IsNumber()
  orden?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLeccionDto)
  lecciones?: CreateLeccionDto[] = [];
}
