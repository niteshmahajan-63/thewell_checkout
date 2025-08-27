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
        const url = `/checkout/download-invoice?recordId=${recordId}`
        const response = await api.get<DownloadInvoiceResponse>(url);

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

export const downloadInvoice = async (recordId: string): Promise<DownloadInvoiceResponse> => {
    try {
        const url = `/checkout/download-due-invoice?recordId=${recordId}`
        const response = await api.get<DownloadInvoiceResponse>(url);

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