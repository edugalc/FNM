import { Module } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CursoService],
  controllers: [CursoController]
})
export class CursoModule {}
