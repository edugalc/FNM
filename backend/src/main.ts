import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // URL del frontend
    credentials: true,               
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true,  // lanza error si llegan propiedades extra
      transform: true,             // convierte automáticamente strings a number, etc.
    }),
  );

  await app.listen(3001);
  console.log('Servidor corriendo en http://localhost:3001');
}
bootstrap();
