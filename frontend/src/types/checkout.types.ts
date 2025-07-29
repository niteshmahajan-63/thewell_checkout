export interface CheckoutRecordResponse {
    success: boolean;
    message: string;
    timestamp: string;
    statusCode: number;
    data: {
        record: CheckoutRecord;
        client_secret: string;
    };
}

export interface CheckoutRecord {
    ID: string;
    Payment_Date: string;
    Stripe_Customer_ID: string;
    Stripe_Payment_ID: string;
    Payment_Status: string;
    Amount: string;
    Stripe_Invoice_ID: string;
    Invoice_Name: string;
    CRM_Payment_Record_ID: string;
    Payment_Source: string;
    Invoice_Type: string;
    dbId: string;
    Invoiced_Items: InvoicedItems[];
}

export interface InvoicedItems {
    Product_Description: string;
    Stripe_Product_ID: string;
    Amount: string;
    Product_Name: string;
    Quantity: string;
    Stripe_Discount_ID: string;
    Stripe_Price_ID: string;
    ID: string;
    zc_display_value: string;
}

export interface PaymentIntentRequest {
    recordId: string;
}

export interface PaymentIntentResponse {
    success: boolean;
    message: string;
    timestamp: string;
    statusCode: number;
    data: string;
}

export interface DownloadInvoiceResponse {
    success: boolean;
    message: string;
    timestamp: string;
    statusCode: number;
    data: string;
}