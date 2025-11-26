import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-10-29.clover',
  });

  async createCheckoutSession(data: any) {
    if (data.tipo && data.id) {
      return this.checkoutProducto({
        id: data.id,
        tipo: data.tipo,
        titulo: data.titulo,
        precio: data.precio,
        userId: data.userId,
      });
    }

    if (data.items && Array.isArray(data.items)) {
      return this.checkoutCarrito({
        userId: data.userId,
        items: data.items,
      });
    }

    throw new Error('Formato inválido para createCheckoutSession');
  }

  async checkoutProducto(data: {
    id: number;
    tipo: 'EBOOK' | 'CURSO';
    titulo: string;
    precio: number;
    userId: number;
  }) {
    if (!data.id || !data.tipo || !data.userId) {
      throw new Error("Faltan datos obligatorios para el pago individual.");
    }

    return await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],

      line_items: [
        {
          price_data: {
            currency: 'mxn',
            unit_amount: Math.round(data.precio * 100),
            product_data: {
              name: `${data.tipo === 'EBOOK' ? 'Ebook' : 'Curso'}: ${data.titulo}`,
            },
          },
          quantity: 1,
        },
      ],

      metadata: {
        tipo: data.tipo,  
        productId: String(data.id),
        userId: String(data.userId),
        esCarrito: "0",
      },

      success_url: `${process.env.FRONTEND_URL}/pagos/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pagos/cancel`,
    });
  }


  async checkoutCarrito(data: {
    userId: number;
    items: {
      tipo: 'EBOOK' | 'CURSO';
      id: number;
      titulo: string;
      precio: number;
      cantidad: number;
    }[];
  }) {
    if (!data.userId || !data.items.length) {
      throw new Error("La información del carrito no es válida.");
    }

    const line_items = data.items.map(item => ({
      price_data: {
        currency: 'mxn',
        unit_amount: Math.round(item.precio * 100),
        product_data: {
          name: `${item.tipo === 'EBOOK' ? 'Ebook' : 'Curso'}: ${item.titulo}`,
        },
      },
      quantity: item.cantidad,
    }));

    return await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,

      metadata: {
        userId: String(data.userId),
        esCarrito: '1',
        items: JSON.stringify(data.items),
      },

      success_url: `${process.env.FRONTEND_URL}/pagos/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pagos/cancel`,
    });
  }
}
