import { IsString } from 'class-validator';

export class UploadEbookFileDto {
  @IsString()
  ebookId: string;
}
