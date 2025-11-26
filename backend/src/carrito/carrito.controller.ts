import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('carrito')
@UseGuards(JwtAuthGuard)
export class CarritoController {
  constructor(private carritoService: CarritoService) {}

  @Get()
  async getCarrito(@Req() req) {
    return this.carritoService.listCarrito(req.user.id);
  }

  @Post('add/ebook/:ebookId')
  async addEbook(@Req() req, @Param('ebookId') ebookId: string) {
    return this.carritoService.addEbook(req.user.id, Number(ebookId));
  }

  @Patch('update/ebook/:ebookId')
  async updateQuantity(
    @Req() req,
    @Param('ebookId') ebookId: string,
    @Body('cantidad') cantidad: number,
  ) {
    return this.carritoService.updateEbookQuantity(req.user.id, Number(ebookId), cantidad);
  }

  @Delete('remove/ebook/:ebookId')
  async removeEbook(@Req() req, @Param('ebookId') ebookId: string) {
    return this.carritoService.removeItem(req.user.id, Number(ebookId));
  }

  @Delete('clear')
  async clearCarrito(@Req() req) {
    return this.carritoService.clearCarrito(req.user.id);
  }
}
