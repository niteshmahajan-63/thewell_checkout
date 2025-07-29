import type {
    CheckoutRecordResponse,
    DownloadInvoiceResponse,
} from "../types/checkout.types";
import api from "./api";

export const getCheckoutByRecordId = async (recordId: string): Promise<CheckoutRecordResponse> => {
    try {
        const url = `/checkout/get-record?recordId=${recordId}`
        const response = await api.get<CheckoutRecordResponse>(url);

        if (!response.data.success) {
            const errorMessage = response.data.message || "Failed to fetch record";
            throw new Error(errorMessage);
        }

        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            const apiError = error.response.data;
            if (!apiError.success) {
                const errorMessage = apiError.message || "Failed to fetch record";
                throw new Error(errorMessage);
            }
        }

        let message = "Something went wrong while fetching record";
        if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === "string") {
            message = error;
        } else if (typeof error === "object" && error !== null && "message" in error) {
            message = (error as { message: string }).message;
        }
        throw new Error(message);
    }
};

export const downloadReceipt = async (recordId: string): Promise<DownloadInvoiceResponse> => {
    try {
        console.log(recordId);
        const response = {
            success: true,
            data: "https://pay.stripe.com/invoice/acct_1PiGvFRuy57noyoW/test_YWNjdF8xUGlHdkZSdXk1N25veW9XLF9Ta0g4RHFldjJXdHdQQ09kUjlWbXN5em1YYTdmUzZkLDE0Mzk5NDM4OA0200UkjodUF9/pdf?s=ap",
            message: "Record retrieved successfully",
            timestamp: "2025-07-26T10:20:05.466Z",
            statusCode: 200
        };

        return response;
    } catch (error: any) {
        if (error.response?.data) {
            const apiError = error.response.data;
            if (!apiError.success) {
                const errorMessage = apiError.message || "Failed to fetch record";
                throw new Error(errorMessage);
            }
        }

        let message = "Something went wrong while fetching record";
        if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === "string") {
            message = error;
        } else if (typeof error === "object" && error !== null && "message" in error) {
            message = (error as { message: string }).message;
        }
        throw new Error(message);
    }
};

export const downloadInvoice = async (recordId: string): Promise<DownloadInvoiceResponse> => {
    try {
        console.log(recordId);
        const response = {
            success: true,
            data: "https://invoice.stripe.com/i/acct_1PiGvFRuy57noyoW/test_YWNjdF8xUGlHdkZSdXk1N25veW9XLF9Ta0g4RHFldjJXdHdQQ09kUjlWbXN5em1YYTdmUzZkLDE0Mzk5NDM4OA0200UkjodUF9?s=ap",
            message: "Record retrieved successfully",
            timestamp: "2025-07-26T10:20:05.466Z",
            statusCode: 200
        };

        return response;
    } catch (error: any) {
        if (error.response?.data) {
            const apiError = error.response.data;
            if (!apiError.success) {
                const errorMessage = apiError.message || "Failed to fetch record";
                throw new Error(errorMessage);
            }
        }

        let message = "Something went wrong while fetching record";
        if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === "string") {
            message = error;
        } else if (typeof error === "object" && error !== null && "message" in error) {
            message = (error as { message: string }).message;
        }
        throw new Error(message);
    }
};

export const checkPaymentStatus = async (recordId: string): Promise<string> => {
    try {
        console.log(recordId);
        const response = {
            success: true,
            data: {
                status: "succeeded"
            },
            message: "Record retrieved successfully",
            timestamp: "2025-07-26T10:20:05.466Z",
            statusCode: 200
        };

        return response.data.status;
    } catch (error: any) {
        if (error.response?.data) {
            const apiError = error.response.data;
            if (!apiError.success) {
                const errorMessage = apiError.message || "Failed to fetch payment intent status";
                throw new Error(errorMessage);
            }
        }

        let message = "Something went wrong while fetching payment intent status";
        if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === "string") {
            message = error;
        } else if (typeof error === "object" && error !== null && "message" in error) {
            message = (error as { message: string }).message;
        }
        throw new Error(message);
    }
};