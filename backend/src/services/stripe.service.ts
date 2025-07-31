import { Injectable } from "@nestjs/common";
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    /**
     * Retrieves a Stripe customer by their ID
     * @param customerId The ID of the Stripe customer
     * @returns The Stripe customer object
     */
    async getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
        try {
            const invoice = await this.stripe.invoices.retrieve(invoiceId);
            return invoice;
        } catch (error) {
            throw new Error(`Failed to retrieve invoice: ${error.message}`);
        }
    }

    async getPaymentIntent(paymentIntentId: string): Promise<{ status: string, amount: number, currency: string }> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return {
                status: paymentIntent.status,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency
            };
        } catch (error) {
            throw new Error(`Failed to check payment status: ${error.message}`);
        }
    }

    async getPaymentMethod(paymentMethodId: string): Promise<string> {
        try {
            const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);
            if (paymentMethod.type === 'us_bank_account') {
                return 'ACH';
            } else if (paymentMethod.type === 'card') {
                return 'Credit Card/Debit Card';
            } else {
                return 'Bank Transfer';
            }
        } catch (error) {
            throw new Error(`Failed to retrieve payment method: ${error.message}`);
        }
    }

    async createCheckoutPaymentIntent(record: Record<string, any>) {
        if (record.Invoice_Type == "Only Placement Fee" || record.Invoice_Type == "Only Setup Fee") {
            const invoice = await this.stripe.invoices.create({
                customer: record.Stripe_Customer_ID,
                collection_method: 'send_invoice',
                days_until_due: 0,
                payment_settings: {
                    payment_method_types: ['card', 'us_bank_account', 'customer_balance'],
                    payment_method_options: {
                        customer_balance: {
                            bank_transfer: {
                                type: 'us_bank_transfer'
                            },
                            funding_type: 'bank_transfer'
                        }
                    }
                }
            });

            if (invoice) {
                for (const item of record.Invoiced_Items || []) {
                    await this.stripe.invoiceItems.create({
                        customer: record.Stripe_Customer_ID,
                        invoice: invoice.id,
                        amount: item.Amount * 100,
                        description: `${item.Product_Name}, ${item.Product_Description}`,
                    });
                }

                const finalizedInvoice = await this.stripe.invoices.finalizeInvoice(invoice.id, {
                    expand: ['confirmation_secret'],
                });

                if (finalizedInvoice) {
                    const client_secret = finalizedInvoice.confirmation_secret.client_secret;

                    return {
                        client_secret: client_secret,
                        invoice_id: invoice.id,
                    };
                } else {
                    throw new Error('Failed to finalize invoice');
                }
            } else {
                throw new Error('Failed to create invoice');
            }
        } else {
            throw new Error("Invalid Invoice Type");
        }
    }
}