import { IsString } from 'class-validator';

export class UploadEbookPortadaDto {
  @IsString()
  ebookId: string;
}
