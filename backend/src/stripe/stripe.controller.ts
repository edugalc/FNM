import { Controller, Post, Body, BadRequestException, Get, Query } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('stripe')
export class StripeController {
  constructor(
    private stripeService: StripeService,
    private prisma: PrismaService,
  ) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() body: any) {
    if (!body) {
      throw new BadRequestException('El body no puede estar vacío');
    }

    return this.stripeService.createCheckoutSession(body);
  }

  @Get('verify')
  async verify(@Query('session_id') sessionId: string) {
    if (!sessionId) {
      return { message: 'session_id faltante' };
    }

    const pago = await this.prisma.pago.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (!pago) {
      return { message: 'Pago aún no registrado (esperando webhook)' };
    }

    const tipo = pago.ebookId ? "EBOOK" : pago.cursoId ? "CURSO" : null;
    const productId = pago.ebookId || pago.cursoId || null;

    return {
      message: 'Pago registrado correctamente',
      pago,
      tipo,
      productId,
    };
  }
}
