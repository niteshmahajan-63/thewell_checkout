import { IsString, IsNotEmpty } from 'class-validator';

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