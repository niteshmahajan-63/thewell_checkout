import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ApiResponse, createSuccessResponse } from 'src/common/utils';
import { CheckoutService } from './checkout.service';
import { GetRecordByIdDto } from './dto';

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
				'Record and onboarding steps retrieved successfully'
			);
        } catch (error) {
            this.logger.error(`Failed to fetch record with steps for ${recordId}:`, error.message);
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
}
