import { Injectable, Logger } from '@nestjs/common';
import { ZohoService } from '../services/zoho.service';
import { CheckoutRepository } from './checkout.repository';
import { StripeService } from 'src/services/stripe.service';

@Injectable()
export class CheckoutService {
    private readonly logger = new Logger(CheckoutService.name);

    constructor(
        private readonly zohoService: ZohoService,
        private readonly stripeService: StripeService,
        private readonly checkoutRepository: CheckoutRepository,
    ) { }

    async getRecords(): Promise<Record<string, any>> {
        return this.zohoService.getRecords();
    }

    async getRecordById(
        recordId: string,
    ): Promise<Record<string, any>> {
        const zohoRecord = await this.zohoService.getRecordById(recordId);

        const checkoutData = {
            zohoRecordId: zohoRecord.ID,
            stripeCustomerId: zohoRecord.Stripe_Customer_ID || null,
            amount: zohoRecord.Amount || null,
            subscriptionScheduledDays: zohoRecord.Subscription_Scheduled_Days || null,
            stripeInvoiceID: zohoRecord.Stripe_Invoice_ID || null,
            invoiceName: zohoRecord.Invoice_Name || null,
            paymentSource: zohoRecord.Payment_Source || null,
            paymentDate: zohoRecord.Payment_Date || null,
            stripePaymentId: zohoRecord.Stripe_Payment_ID || null,
            paymentStatus: zohoRecord.Payment_Status || null,
            crmPaymentRecordId: zohoRecord.CRM_Payment_Record_ID || null,
            invoiceType: zohoRecord.Invoice_Type || null,
        };

        try {
            const savedCheckout = await this.checkoutRepository.upsertCheckout(checkoutData);

            if (savedCheckout) {
                for (const item of zohoRecord.Invoiced_Items || []) {
                    const itemData = {
                        zohoRecordId: checkoutData.zohoRecordId,
                        invoiceItemId: item.ID,
                        stripePriceId: item.Stripe_Price_ID || null,
                        stripeProductId: item.Stripe_Product_ID || null,
                        productName: item.Product_Name || null,
                        amount: item.Amount || null,
                        quantity: item.Quantity || null,
                        productDescription: item.Product_Description || null,
                        stripeDiscountId: item.Stripe_Discount_ID || null,
                        zcdisplayValue: item.zc_display_value || null,
                        checkoutClientId: savedCheckout.id,
                    };
                    await this.checkoutRepository.upsertCheckoutInvoiceItem(itemData);
                }

                this.logger.log(`Record ${recordId} saved/updated in the database with id: ${savedCheckout.id}`);

                return { ...zohoRecord, dbId: savedCheckout.id };
            } else {
                this.logger.error(`Failed to save/update record in database for ${recordId}`);
                return zohoRecord;
            }
        } catch (error) {
            this.logger.error(`Failed to save/update record in database: ${error.message}`);
            return zohoRecord;
        }
    }

    async getRecord(
        recordId: string,
    ): Promise<{ record: Record<string, any>; client_secret: string }> {
        const record = await this.getRecordById(recordId);

        let client_secret = null;

        const existingPaymentIntent = await this.checkoutRepository.getCheckoutByZohoRecordId(record.ID);
        
        if (existingPaymentIntent.clientSecret !== null) {
            client_secret = existingPaymentIntent.clientSecret;
        } else {
            const paymentIntent = await this.stripeService.createCheckoutPaymentIntent(record);
            if (paymentIntent) {
                client_secret = paymentIntent.client_secret;
                const invoice_id = paymentIntent.invoice_id;
                await this.checkoutRepository.upsertCheckout({
                    zohoRecordId: record.ID,
                    clientSecret: client_secret,
                    stripeInvoiceID: invoice_id,
                    stripeCustomerId: record.Stripe_Customer_ID,
                    amount: record.Amount,
                });
            }
        }

        return { record, client_secret };
    }
}
