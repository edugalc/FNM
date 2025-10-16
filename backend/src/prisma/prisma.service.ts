import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Prisma conectado correctamente');
    } catch (error) {
      console.error('Error al conectar Prisma:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
