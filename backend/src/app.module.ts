import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CheckoutModule } from './checkout/checkout.module';
import { WebhookModule } from './webhook/webhook.module';
import { SlackService } from './common/slack.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		CheckoutModule,
		WebhookModule
	],
	providers: [SlackService],
	exports: [SlackService],
})
export class AppModule { }
