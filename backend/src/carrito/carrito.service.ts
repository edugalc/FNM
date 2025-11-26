import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CarritoService {
  constructor(private prisma: PrismaService) {}

  // Obtener o crear carrito de un usuario
  async getOrCreateCarrito(userId: number) {
    let carrito = await this.prisma.carrito.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!carrito) {
      carrito = await this.prisma.carrito.create({
        data: { userId },
        include: { items: true },
      });
    }

    return carrito;
  }
  // Listar carrito completo y total de items
  async listCarrito(userId: number) {
    const carrito = await this.getOrCreateCarrito(userId);

    const items = await this.prisma.carritoItem.findMany({
      where: { carritoId: carrito.id },
      include: { ebook: true, curso: true },
    });

    //  Calcular total de cantidades
    const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

    return {
      ...carrito,
      items,
      totalItems,
    };
  }


  // Agregar ebook al carrito
  async addEbook(userId: number, ebookId: number) {
    const carrito = await this.getOrCreateCarrito(userId);

    const existingItem = await this.prisma.carritoItem.findFirst({
      where: { carritoId: carrito.id, ebookId },
    });

    if (existingItem) {
      return this.prisma.carritoItem.update({
        where: { id: existingItem.id },
        data: { cantidad: existingItem.cantidad + 1 },
      });
    }

    return this.prisma.carritoItem.create({
      data: { carritoId: carrito.id, ebookId, cantidad: 1 },
    });
  }

  // Actualizar cantidad de un ebook en el carrito
  async updateEbookQuantity(userId: number, ebookId: number, cantidad: number) {
    const carrito = await this.getOrCreateCarrito(userId);

    const item = await this.prisma.carritoItem.findFirst({
      where: { carritoId: carrito.id, ebookId },
    });

    if (!item) {
      throw new NotFoundException('El ebook no está en el carrito');
    }

    return this.prisma.carritoItem.update({
      where: { id: item.id },
      data: { cantidad },
    });
  }

  // Eliminar un item del carrito
  async removeItem(userId: number, ebookId: number) {
    const carrito = await this.getOrCreateCarrito(userId);

    const item = await this.prisma.carritoItem.findFirst({
      where: { carritoId: carrito.id, ebookId },
    });

    if (!item) {
      throw new NotFoundException('El ebook no está en el carrito');
    }

    return this.prisma.carritoItem.delete({ where: { id: item.id } });
  }

  // Vaciar carrito completo
  async clearCarrito(userId: number) {
    const carrito = await this.getOrCreateCarrito(userId);

    return this.prisma.carritoItem.deleteMany({ where: { carritoId: carrito.id } });
  }
}
