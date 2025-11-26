import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CursoModule } from './curso/curso.module';
import { EbookModule } from './ebook/ebook.module';
import { AuthModule } from './auth/auth.module';
import { UploadController } from './uploads/upload.controller';
import { CarritoModule } from './carrito/carrito.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [UsersModule, CursoModule, EbookModule, AuthModule, CarritoModule, StripeModule],
  controllers: [UploadController],
  providers: [],
})
export class AppModule {}
