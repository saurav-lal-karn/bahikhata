import apiClient from "@/lib/axios";

export interface ReceiptData {
    merchant_name: string;
    total_amount: number;
    currency: string;
    date?: string;
    category?: string;
    description?: string;
    line_items: Array<{
        description: string;
        amount: number;
        quantity?: number;
    }>;
    payment_method?: string;
    location?: string;
    vendor?: string;
    bill_number?: string;
    invoice_number?: string;
    document_type?: string;
}

export interface FieldConfidence {
    [key: string]: number;
}

export interface AnalysisResponse {
    extracted_data: ReceiptData;
    confidence_score: number;
    field_confidence?: FieldConfidence;
}

export const aiService = {
    analyzeFile: async (
        file: File,
        familyId: string
    ): Promise<AnalysisResponse> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post(
            `/ai/analyze?family_id=${familyId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data.data as AnalysisResponse;
    },
    analyzeExpenseFile: async (
        file: File,
        familyId: string
    ): Promise<AnalysisResponse> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post(
            `/ai/analyze-expense?family_id=${familyId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data.data as AnalysisResponse;
    },
    ocrClassify: async (
        file: File,
        familyId: string
    ): Promise<{
        ocr_text: string;
        transaction_type: string;
        category: string;
        confidence_score: number;
    }> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post(
            `/ai/ocr-classify?family_id=${familyId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data.data;
    },
    extractStructured: async (
        ocrText: string,
        transactionType: string,
        category?: string
    ): Promise<AnalysisResponse> => {
        const response = await apiClient.post("/ai/extract-structured", {
            ocr_text: ocrText,
            transaction_type: transactionType,
            category,
        });

        return response.data.data as AnalysisResponse;
    },
    storeDocument: async (
        fileId: string,
        ocrText: string,
        metadata?: any
    ): Promise<any> => {
        const response = await apiClient.post("/ai/store-document", {
            file_id: fileId,
            ocr_text: ocrText,
            metadata,
        });

        return response.data.data;
    },
};
