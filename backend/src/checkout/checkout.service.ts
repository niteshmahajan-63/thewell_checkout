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
        zohoRecord: Record<string, any>,
    ): Promise<Record<string, any>> {
        const checkoutData = {
            zohoRecordId: zohoRecord.ID,
            stripeCustomerId: zohoRecord.Stripe_Customer_ID || null,
            amount: zohoRecord.Total_Amount || null,
            subscriptionScheduledDays: zohoRecord.Subscription_Scheduled_Days || null,
            stripeInvoiceID: zohoRecord.Stripe_Invoice_ID || null,
            invoiceName: zohoRecord.Invoice_Name || null,
            paymentSource: zohoRecord.Payment_Source || null,
            paymentDate: zohoRecord.Payment_Date || null,
            stripePaymentId: zohoRecord.Stripe_Payment_ID || null,
            paymentStatus: zohoRecord.Payment_Status || null,
            crmPaymentRecordId: zohoRecord.CRM_Payment_Record_ID || null,
            invoiceType: zohoRecord.Invoice_Type || null,
            companyName: zohoRecord.Company_Name || null,
            customerEmail: zohoRecord.Customer_Email || null,
            deactivatedLink: zohoRecord.Deactivated_Link || null,
            microdepositUrl: zohoRecord.Microdeposit_URL || {},
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

                this.logger.log(`Record ${zohoRecord.ID} saved/updated in the database with id: ${savedCheckout.id}`);

                return { ...zohoRecord, dbId: savedCheckout.id };
            } else {
                this.logger.error(`Failed to save/update record in database for ${zohoRecord.ID}`);
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
        const zohoRecord = await this.zohoService.getRecordById(recordId);

        let client_secret = null;

        const existingPaymentIntent = await this.checkoutRepository.getCheckoutByZohoRecordId(recordId);
        
        if (existingPaymentIntent && existingPaymentIntent.clientSecret !== null) {
            client_secret = existingPaymentIntent.clientSecret;
        } else {
            const paymentIntent = await this.stripeService.createCheckoutPaymentIntent(zohoRecord);
            if (paymentIntent) {
                await this.getRecordById(zohoRecord);
                client_secret = paymentIntent.client_secret;
                const invoice_id = paymentIntent.invoice_id;
                await this.checkoutRepository.upsertCheckout({
                    zohoRecordId: recordId,
                    clientSecret: client_secret,
                    stripeInvoiceID: invoice_id,
                    stripeCustomerId: zohoRecord.Stripe_Customer_ID,
                    amount: zohoRecord.Total_Amount,
                });
            }
        }

        return { 
            record: zohoRecord, 
            client_secret 
        };
    }

    async downloadInvoice(recordId: string): Promise<string> {
		this.logger.log(`Downloading invoice for record: ${recordId}`);

		try {
			const stripePaymentRecord = await this.checkoutRepository.getCheckoutByZohoRecordId(recordId);
			if (!stripePaymentRecord) {
				throw new Error(`No Stripe payment record found for record ID ${recordId}`);
			}
			return stripePaymentRecord.hostedInvoiceUrl;
		} catch (error) {
			this.logger.error(`Failed to download invoice for record ${recordId}: ${error.message}`);
			throw error;
		}
	}

    async downloadDueInvoice(recordId: string): Promise<string> {
		this.logger.log(`Downloading due invoice for record: ${recordId}`);

		try {
			const stripePaymentRecord = await this.checkoutRepository.getCheckoutByZohoRecordId(recordId);
            console.log(stripePaymentRecord);
            

			if (!stripePaymentRecord || !stripePaymentRecord.stripeInvoiceID) {
				throw new Error(`No Invoice found for record ID ${recordId}`);
			}

			const invoice = await this.stripeService.getInvoice(stripePaymentRecord.stripeInvoiceID);
			if (!invoice) {
				throw new Error(`No Stripe payment record found for record ID ${recordId}`);
			}
			return invoice.invoice_pdf || '';
		} catch (error) {
			this.logger.error(`Failed to download due invoice for record ${recordId}: ${error.message}`);
			throw error;
		}
	}

    async checkPaymentStatus(recordId: string): Promise<{ status: string }> {
		this.logger.log(`Checking payment status for recordId: ${recordId}`);

		try {
			const paymentRecord = await this.checkoutRepository.getStripePaymentRecord(recordId);
			
			if (!paymentRecord) {
				throw new Error(`Payment intent with ID ${recordId} not found`);
			}

			return {
				status: paymentRecord.paymentStatus
			};
		} catch (error) {
			this.logger.error(`Failed to check payment status for recordId ${recordId}: ${error.message}`);
			throw error;
		}
	}
}
