import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CursoModule } from './curso/curso.module';
import { EbookModule } from './ebook/ebook.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, CursoModule, EbookModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
