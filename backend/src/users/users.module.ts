import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  imports: [PrismaModule],
})
export class UsersModule {}
