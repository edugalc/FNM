import { Module } from '@nestjs/common';
import { EbookService } from './ebook.service';
import { EbookController } from './ebook.controller';

@Module({
  providers: [EbookService],
  controllers: [EbookController]
})
export class EbookModule {}
