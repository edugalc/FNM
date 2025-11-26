import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  InternalServerErrorException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('stripe')
export class StripeWebhookController {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) throw new Error('STRIPE_SECRET_KEY no está definida');

    this.stripe = new Stripe(secret);
  }

  @Post('webhook')
async handleWebhook(
  @Req() req,
  @Res() res,
  @Headers('stripe-signature') signature: string,
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
  throw new InternalServerErrorException('Webhook secret no configurado');
}

  let event: Stripe.Event;

  try {
    event = this.stripe.webhooks.constructEvent(
      req.body,          //  raw buffer
      signature,
      webhookSecret,
    );
  } catch (err: any) {
    console.error(' Error verificando webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook recibido:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await this.procesarPago(session);
  }

  res.status(200).send('OK');
}


  async procesarPago(session: Stripe.Checkout.Session) {
    // evita duplicados
    const existente = await this.prisma.pago.findUnique({
      where: { stripeSessionId: session.id },
    });

    if (existente) return;

    const userId = Number(session.metadata?.userId);
    const esCarrito = session.metadata?.esCarrito === '1';

    if (esCarrito) {
      return this.registrarPagoCarrito(userId, session);
    }

    return this.registrarPagoIndividual(userId, session);
  }

  async registrarPagoIndividual(userId: number, session: Stripe.Checkout.Session) {
    const productId = Number(session.metadata!.productId);
    const tipo = session.metadata!.tipo;

    await this.prisma.pago.create({
      data: {
        userId,
        status: 'COMPLETADO',
        monto: (session.amount_total ?? 0) / 100,
        stripeSessionId: session.id,
        stripePaymentIntent: session.payment_intent?.toString() ?? null,
        stripeCustomerId: session.customer?.toString() ?? null,
        ebookId: tipo === 'EBOOK' ? productId : null,
        cursoId: tipo === 'CURSO' ? productId : null,
      },
    });

    if (tipo === 'EBOOK') {
      await this.prisma.ebookUser.upsert({
        where: { ebookId_userId: { ebookId: productId, userId } },
        update: {},
        create: { ebookId: productId, userId },
      });
    } else {
      await this.prisma.cursoUser.upsert({
        where: { cursoId_userId: { cursoId: productId, userId } },
        update: {},
        create: { cursoId: productId, userId },
      });
    }
  }

  async registrarPagoCarrito(userId: number, session: Stripe.Checkout.Session) {
    const items = JSON.parse(session.metadata!.items);

    for (const item of items) {
      await this.prisma.pago.create({
        data: {
          userId,
          status: 'COMPLETADO',
          monto: item.precio * item.cantidad,
          stripeSessionId: session.id,
          stripePaymentIntent: session.payment_intent?.toString() ?? null,
          stripeCustomerId: session.customer?.toString() ?? null,
          ebookId: item.tipo === 'EBOOK' ? item.id : null,
          cursoId: item.tipo === 'CURSO' ? item.id : null,
        },
      });

      if (item.tipo === 'EBOOK') {
        await this.prisma.ebookUser.upsert({
          where: { ebookId_userId: { ebookId: item.id, userId } },
          update: {},
          create: { ebookId: item.id, userId },
        });
      }

      if (item.tipo === 'CURSO') {
        await this.prisma.cursoUser.upsert({
          where: { cursoId_userId: { cursoId: item.id, userId } },
          update: {},
          create: { cursoId: item.id, userId },
        });
      }
    }

    await this.prisma.carritoItem.deleteMany({
      where: { carrito: { userId } },
    });
  }
}
