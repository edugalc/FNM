import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateOpcionDto {
  @IsOptional()
  @IsString()
  texto?: string;

  @IsOptional()
  @IsBoolean()
  esCorrecta?: boolean;
}
