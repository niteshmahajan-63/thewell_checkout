import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GetRecordByIdDto {
	@IsString()
	@IsNotEmpty()
	recordId: string;
}

export class CheckPaymentStatusDto {
	@IsString()
	@IsNotEmpty()
	recordId: string;
}

export class SendSlackMessageDto {
	@IsOptional()
	@IsString()
	message?: string;

	@IsOptional()
	@IsString()
	errorMessage?: string;

	@IsOptional()
	@IsString()
	component?: string;

	@IsOptional()
	@IsString()
	page?: string;

	@IsOptional()
	@IsString()
	userAction?: string;

	@IsOptional()
	@IsString()
	errorStack?: string;

	@IsOptional()
	@IsString()
	browserInfo?: string;

	@IsOptional()
	@IsString()
	recordId?: string;

	@IsOptional()
	errorType?: 'javascript' | 'api' | 'network' | 'validation' | 'general';

	@IsOptional()
	severity?: 'low' | 'medium' | 'high' | 'critical';

	@IsOptional()
	additionalContext?: Record<string, any>;
}