import { IsString, IsBoolean } from 'class-validator';

export class CreateOpcionDto {
  @IsString()
  texto: string;

  @IsBoolean()
  esCorrecta: boolean;
}
