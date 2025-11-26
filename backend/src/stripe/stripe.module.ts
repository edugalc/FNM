import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { StripeWebhookController } from './webhook/stripe.webhook.controller';
import { PrismaService } from '../prisma/prisma.service';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  controllers: [StripeWebhookController, StripeController],
  providers: [PrismaService, StripeService],
})
export class StripeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
