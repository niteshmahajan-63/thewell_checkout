import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class CheckoutRepository {
    private readonly logger = new Logger(CheckoutRepository.name);

    constructor(private readonly prisma: PrismaService) { }

    async upsertCheckout(clientData: any): Promise<any> {
        return this.prisma.checkoutClient.upsert({
            where: { zohoRecordId: clientData.zohoRecordId },
            update: clientData,
            create: clientData,
        });
    }

    async upsertCheckoutInvoiceItem(itemData: any): Promise<any> {
        return this.prisma.checkoutInvoiceItems.upsert({
            where: {
                invoiceItemId: itemData.invoiceItemId,
                checkoutClientId: itemData.checkoutClientId,
                id: itemData.id || 0,
            },
            update: itemData,
            create: itemData,
        });
    }

    async getCheckoutByZohoRecordId(zohoRecordId: string): Promise<any> {
        return this.prisma.checkoutClient.findUnique({
            where: { zohoRecordId }
        });
    }

    async getStripePaymentRecord(recordId: string): Promise<any> {
        return this.prisma.checkoutClient.findFirst({
            where: { zohoRecordId: recordId },
        });
    }
}
