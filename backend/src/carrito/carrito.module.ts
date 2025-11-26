import { Module } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [CarritoService],
  controllers: [CarritoController],
  imports: [PrismaModule],
})
export class CarritoModule {}
