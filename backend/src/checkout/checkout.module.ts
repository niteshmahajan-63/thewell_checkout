import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { ZohoService } from 'src/services/zoho.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { zohoConfig } from 'src/config/zoho.config';
import { CheckoutRepository } from './checkout.repository';
import { PrismaService } from 'src/common/prisma.service';
import { StripeService } from 'src/services/stripe.service';
import { SlackService } from 'src/common/slack.service';

@Module({
	imports: [
		HttpModule,
		ConfigModule.forFeature(zohoConfig),
	],
	controllers: [CheckoutController],
	providers: [
		CheckoutService,
		CheckoutRepository,
		PrismaService,
		StripeService,
		ZohoService,
		SlackService
	],
	exports: [CheckoutService],
})
export class CheckoutModule { }
