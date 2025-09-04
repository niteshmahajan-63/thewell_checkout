import { Injectable, Logger } from '@nestjs/common';
import { PaymentGateway } from './payment.gateway';
import { ConfigService } from '@nestjs/config';
import { WebhookRepository } from './webhook.repository';
import Stripe from 'stripe';
import { StripeService } from '../services/stripe.service';
import { ZohoService } from 'src/services/zoho.service';

@Injectable()
export class WebhookService {
    private readonly logger = new Logger(WebhookService.name);
    private readonly stripeWebhookSecret: string;
    private readonly stripeApiKey: string;

    constructor(
        private configService: ConfigService,
        private webhookRepository: WebhookRepository,
        private stripeService: StripeService,
        private paymentGateway: PaymentGateway,
        private readonly zohoService: ZohoService,
    ) {
        // Initialize Stripe webhook secret
        this.stripeWebhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SIGNING_KEY');
        if (!this.stripeWebhookSecret) {
            this.logger.warn('STRIPE_WEBHOOK_SIGNING_KEY is not set in environment variables');
        }

        // Initialize Stripe API key
        this.stripeApiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
        if (!this.stripeApiKey) {
            this.logger.warn('STRIPE_SECRET_KEY is not set in environment variables');
        }
    }

    async validateStripeSignature(signature: string, body: string | Buffer): Promise<Stripe.Event | boolean> {
        if (!this.stripeWebhookSecret) {
            this.logger.error('Cannot validate Stripe signature: STRIPE_WEBHOOK_SIGNING_KEY is not set');
            return false;
        }

        if (!this.stripeApiKey) {
            this.logger.error('Cannot validate Stripe signature: STRIPE_SECRET_KEY is not set');
            return false;
        }

        if (!signature) {
            this.logger.warn('Missing Stripe webhook signature header');
            return false;
        }

        try {
            const stripe = new Stripe(this.stripeApiKey);

            const event = stripe.webhooks.constructEvent(
                body,
                signature,
                this.stripeWebhookSecret
            );

            this.logger.log(`Stripe signature verification succeeded for event: ${event.type}`);
            return event;
        } catch (error) {
            this.logger.error(`Error validating Stripe signature: ${error.message}`);
            // Log more details for debugging
            this.logger.debug(`Body type: ${typeof body}`);
            this.logger.debug(`Body length: ${body ? body.length : 0}`);
            return false;
        }
    }

    async handleStripeEvent(event: Stripe.Event) {
        const eventType = event.type;
        try {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            let invoice = null;
            let formattedPaymentSource = '';
            let recordExist = null;
            let amount = 0;

            switch (eventType) {
                case 'payment_intent.created':
                    this.logger.log('Stripe payment intent created');
                    return {
                        message: 'Stripe payment_intent.created event processed successfully',
                        success: true
                    };
                case 'payment_intent.succeeded':
                    this.logger.log('Stripe payment intent succeeded');
                    recordExist = await this.webhookRepository.findStripePayment(paymentIntent.client_secret);
                    if (recordExist && recordExist.paymentStatus !== 'succeeded') {
                        invoice = '';
                        if ('invoice' in paymentIntent && paymentIntent.invoice) {
                            invoice = await this.stripeService.getInvoice((paymentIntent as any).invoice);
                        }

                        if (typeof paymentIntent.payment_method === 'string') {
                            formattedPaymentSource = await this.stripeService.getPaymentMethod(paymentIntent.payment_method);
                        }

                        if (formattedPaymentSource === "Bank Transfer" || formattedPaymentSource === "ACH") {
                            this.paymentGateway.emitPaymentSucceededToRecord(recordExist.zohoRecordId, {
                                paymentId: paymentIntent.id
                            });
                        }

                        amount = paymentIntent.amount ? paymentIntent.amount / 100 : 0;

                        await this.webhookRepository.storeStripePayment({
                            clientSecret: paymentIntent.client_secret,
                            stripeCustomerId: paymentIntent.customer,
                            paymentDate: new Date(paymentIntent.created * 1000),
                            paymentStatus: paymentIntent.status,
                            stripePaymentId: paymentIntent.id,
                            amount: amount.toFixed(2),
                            paymentSource: formattedPaymentSource,
                            stripeInvoiceID: invoice ? invoice.id : null,
                            hostedInvoiceUrl: invoice ? invoice.hosted_invoice_url : null,
                            createdAt: new Date(paymentIntent.created * 1000),
                            updatedAt: new Date()
                        });

                        const payload = {
                            Stripe_Invoice_ID: invoice ? invoice.id : null,
                            Payment_Source: formattedPaymentSource,
                            Payment_Date: new Date(paymentIntent.created * 1000),
                            Stripe_Payment_ID: paymentIntent.id,
                            Payment_Status: paymentIntent.status
                        };
                        await this.zohoService.updateRecord(recordExist.zohoRecordId, payload);

                        return {
                            message: 'Stripe payment_intent.succeeded event processed successfully',
                            success: true
                        };
                    } else {
                        break;
                    }
                case 'payment_intent.requires_action':
                    this.logger.log('Stripe payment intent requires action');
                    recordExist = await this.webhookRepository.findStripePayment(paymentIntent.client_secret);
                    if (recordExist && recordExist.paymentStatus !== 'requires_action') {
                        invoice = '';
                        if ('invoice' in paymentIntent && paymentIntent.invoice) {
                            invoice = await this.stripeService.getInvoice((paymentIntent as any).invoice);
                        }

                        if (typeof paymentIntent.payment_method === 'string') {
                            formattedPaymentSource = await this.stripeService.getPaymentMethod(paymentIntent.payment_method);
                        }

                        amount = paymentIntent.amount ? paymentIntent.amount / 100 : 0;

                        this.logger.debug(`Storing payment intent: ${JSON.stringify(paymentIntent)}`);
                        this.logger.debug(`Storing payment intent with microdeposit URL: ${paymentIntent.next_action?.verify_with_microdeposits?.hosted_verification_url}`);

                        await this.webhookRepository.storeStripePayment({
                            clientSecret: paymentIntent.client_secret,
                            stripeCustomerId: paymentIntent.customer,
                            paymentDate: new Date(paymentIntent.created * 1000),
                            paymentStatus: paymentIntent.status,
                            stripePaymentId: paymentIntent.id,
                            amount: amount.toFixed(2),
                            paymentSource: formattedPaymentSource,
                            stripeInvoiceID: invoice ? invoice.id : null,
                            hostedInvoiceUrl: invoice ? invoice.hosted_invoice_url : null,
                            microdepositUrl: paymentIntent.next_action.verify_with_microdeposits.hosted_verification_url,
                            createdAt: new Date(paymentIntent.created * 1000),
                            updatedAt: new Date()
                        });

                        const payload = {
                            Microdeposit_URL: {
                                value: paymentIntent.next_action.verify_with_microdeposits.hosted_verification_url,
                                url: paymentIntent.next_action.verify_with_microdeposits.hosted_verification_url
                            },
                        };
                        await this.zohoService.updateRecord(recordExist.zohoRecordId, payload);

                        return {
                            message: 'Stripe payment_intent.requires_action event processed successfully',
                            success: true
                        };
                    } else {
                        break;
                    }
                case 'payment_intent.payment_failed':
                    this.logger.error('Stripe payment intent failed');

                    recordExist = await this.webhookRepository.findStripePayment(paymentIntent.client_secret);
                    if (recordExist && recordExist.paymentStatus !== 'failed') {
                        const errorMessage = paymentIntent.last_payment_error
                            ? paymentIntent.last_payment_error.message
                            : 'Unknown error';
                        const actualPaymentMethod = paymentIntent.last_payment_error?.payment_method?.type
                            || paymentIntent.payment_method_types?.[0]
                            || 'unknown';

                        formattedPaymentSource = this.formatPaymentSource(actualPaymentMethod);

                        invoice = '';
                        if ('invoice' in paymentIntent && paymentIntent.invoice) {
                            invoice = await this.stripeService.getInvoice((paymentIntent as any).invoice);
                        }

                        const stripePayment = await this.webhookRepository.findStripePayment(paymentIntent.client_secret);
                        if (stripePayment && stripePayment.zohoRecordId) {
                            this.paymentGateway.emitPaymentErrorToRecord(stripePayment.zohoRecordId, {
                                paymentId: paymentIntent.id,
                                error: errorMessage
                            });
                        }

                        amount = paymentIntent.amount ? paymentIntent.amount / 100 : 0;

                        await this.webhookRepository.storeStripePayment({
                            clientSecret: paymentIntent.client_secret,
                            paymentDate: new Date(paymentIntent.created * 1000),
                            paymentStatus: 'failed',
                            stripePaymentId: paymentIntent.id,
                            amount: amount.toFixed(2),
                            paymentSource: formattedPaymentSource,
                            stripeInvoiceID: invoice ? invoice.id : null,
                            hostedInvoiceUrl: invoice ? invoice.hosted_invoice_url : null,
                            errorMessage: errorMessage,
                            createdAt: new Date(paymentIntent.created * 1000),
                            updatedAt: new Date()
                        });

                        return {
                            message: 'Payment intent failed event handled',
                            success: true
                        };
                    } else {
                        break;
                    }

                case 'payment_intent.processing':
                    this.logger.log('Stripe payment intent is processing');

                    recordExist = await this.webhookRepository.findStripePayment(paymentIntent.client_secret);
                    if (recordExist && recordExist.paymentStatus === '') {
                        invoice = '';
                        if ('invoice' in paymentIntent && paymentIntent.invoice) {
                            invoice = await this.stripeService.getInvoice((paymentIntent as any).invoice);
                        }

                        if (typeof paymentIntent.payment_method === 'string') {
                            formattedPaymentSource = await this.stripeService.getPaymentMethod(paymentIntent.payment_method);
                        }

                        amount = paymentIntent.amount ? paymentIntent.amount / 100 : 0;

                        await this.webhookRepository.storeStripePayment({
                            clientSecret: paymentIntent.client_secret,
                            paymentDate: new Date(paymentIntent.created * 1000),
                            paymentStatus: paymentIntent.status,
                            stripePaymentId: paymentIntent.id,
                            amount: amount.toFixed(2),
                            paymentSource: formattedPaymentSource,
                            stripeInvoiceID: invoice ? invoice.id : null,
                            hostedInvoiceUrl: invoice ? invoice.hosted_invoice_url : null,
                            errorMessage: null,
                            createdAt: new Date(paymentIntent.created * 1000),
                            updatedAt: new Date()
                        });
                    } else {
                        break;
                    }

                default:
                    this.logger.log(`Received unhandled Stripe event type: ${eventType}`);
                    return {
                        message: 'Event received but not processed - event type not supported',
                        success: true
                    };
            }
        } catch (error) {
            this.logger.error(`Error processing Stripe payment intent: ${error.message}`);
            if (event?.data?.object) {
                this.logger.debug(`PaymentIntent ID: ${(event.data.object as any).id || 'unknown'}`);
            }

            return {
                message: `Failed to process Stripe payment intent: ${error.message}`,
                success: false
            };
        }
    }

    private formatPaymentSource(paymentType: string): string {
        switch (paymentType) {
            case 'card':
                return 'Credit Card/Debit Card';
            case 'us_bank_account':
                return 'ACH';
            default:
                return 'Bank Transfer';
        }
    }
}
