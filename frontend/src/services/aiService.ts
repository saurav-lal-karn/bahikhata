import apiClient from "@/lib/axios";

export interface AnalysisResponse {
    filename: string;
    file_id: string;
    analysis: {
        category: string;
        confidence: number;
        description: string;
        tags: string[];
        merchant_name: string;
        vendor?: string;
        payer?: string;
        project?: string;
        location?: string;
        payment_method?: string;
        amount: number;
        date: string;
        currency: string;
        type: string;
        transaction_type?: string; // EXPENSE or INCOME
        document_type?: string; // RECEIPT, BILL, INVOICE
        line_items: Array<{
            description: string;
            amount: number;
            quantity?: number;
        }>;
        // Bill/Invoice specific fields
        bill_number?: string;
        due_date?: string;
        invoice_number?: string;
        // Field-level confidence scores
        field_confidence?: {
            [key: string]: number; // field name -> confidence (0-1)
        };
    };
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
};
