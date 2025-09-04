import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ApiResponse, createSuccessResponse } from 'src/common/utils';
import { CheckoutService } from './checkout.service';
import { CheckPaymentStatusDto, GetRecordByIdDto } from './dto';

@Controller('api/checkout')
export class CheckoutController {
    private readonly logger = new Logger(CheckoutController.name);

    constructor(private readonly checkoutService: CheckoutService) { }

    @Get('get-record')
    async getRecord(
        @Query() query: GetRecordByIdDto
    ) {
        const { recordId } = query;

        try {
            const result = await this.checkoutService.getRecord(recordId);

			return createSuccessResponse(
				result,
				'Record retrieved successfully'
			);
        } catch (error) {
            this.logger.error(`Failed to fetch record for ${recordId}:`, error.message);
            throw error;
        }
    }

    @Get('records')
    async getRecords(): Promise<ApiResponse<Record<string, any>>> {
        try {
            const data = await this.checkoutService.getRecords();

            return createSuccessResponse(data, 'Records retrieved successfully');
        } catch (error) {
            this.logger.error(`Failed to fetch records:`, error.message);
            throw error;
        }
    }

    @Get('download-invoice')
	async downloadInvoice(
		@Query() query: GetRecordByIdDto
	): Promise<ApiResponse<string>> {
		const { recordId } = query;

		this.logger.log(`Downloading invoice for record: ${recordId}`);

		try {
			const pandadocSessionId = await this.checkoutService.downloadInvoice(recordId);
			return createSuccessResponse(pandadocSessionId, 'Invoice downloaded successfully');
		} catch (error) {
			this.logger.error(`Failed to download invoice for record ${recordId}:`, error.message);
			throw error;
		}
	}

	@Get('download-due-invoice')
	async downloadDueInvoice(
		@Query() query: GetRecordByIdDto
	): Promise<ApiResponse<string>> {
		const { recordId } = query;

		this.logger.log(`Downloading due invoice for record: ${recordId}`);

		try {
			const pandadocSessionId = await this.checkoutService.downloadDueInvoice(recordId);
			return createSuccessResponse(pandadocSessionId, 'Due invoice downloaded successfully');
		} catch (error) {
			this.logger.error(`Failed to download due invoice for record ${recordId}:`, error.message);
			throw error;
		}
	}

	@Get('check-payment-status')
	async checkPaymentStatus(
		@Query() query: CheckPaymentStatusDto
	): Promise<ApiResponse<{ status: string }>> {
		const { recordId } = query;

		this.logger.log(`Checking payment status for recordId: ${recordId}`);

		try {
			const response = await this.checkoutService.checkPaymentStatus(recordId);
			return createSuccessResponse(response, 'Payment status checked successfully');
		} catch (error) {
			this.logger.error(`Failed to check payment status for recordId ${recordId}:`, error.message);
			throw error;
		}
	}
}
