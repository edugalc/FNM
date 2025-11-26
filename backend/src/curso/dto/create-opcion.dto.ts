import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateOpcionDto {
  @IsString()
  texto!: string;

  @IsBoolean()
  @IsOptional()
  esCorrecta?: boolean = false;
}
