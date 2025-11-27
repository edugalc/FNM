import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

declare global {
  // Evita múltiples instancias de Prisma en entornos de desarrollo con hot reload
  // eslint-disable-next-line no-var
  var prisma: PrismaService | undefined;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({ log: ['query'] });

    if (process.env.NODE_ENV !== 'production' && !global.prisma) {
      global.prisma = this;
    }
  }

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
    if (process.env.NODE_ENV === 'production') {
      await this.$disconnect();
    }
    // En desarrollo no desconectamos para mantener la instancia global
  }
}

// Exporta la instancia global en desarrollo, o crea una nueva en producción
export const prismaService =
  global.prisma || new PrismaService();
