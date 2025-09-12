import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class WebhookRepository {
    private readonly logger = new Logger(WebhookRepository.name);

    constructor(private prismaService: PrismaService) { }

    async findStripePayment(clientSecret: string): Promise<any> {
        try {
            return await this.prismaService.checkoutClient.findFirst({
                where: {
                    clientSecret: clientSecret
                },
                include: {
                    invoiceItems: true,
                },
            });
        } catch (error) {
            this.logger.error(`Error finding Stripe payment: ${error.message}`);
            return null;
        }
    }

    async storeStripePayment(stripePaymentData: any): Promise<any> {
        try {
            const existingPayment = await this.findStripePayment(stripePaymentData.clientSecret);

            if (existingPayment) {
                this.logger.log(`Updating existing Stripe payment for clientSecret: ${stripePaymentData.clientSecret}`);
                return await this.prismaService.checkoutClient.update({
                    where: {
                        clientSecret: stripePaymentData.clientSecret
                    },
                    data: {
                        ...stripePaymentData,
                        updatedAt: new Date()
                    }
                });
            } else {
                this.logger.log(`Stripe payment not found!`);
            }
        } catch (error) {
            this.logger.error(`Error storing Stripe payment: ${error.message}`);
            throw error;
        }
    }
}
