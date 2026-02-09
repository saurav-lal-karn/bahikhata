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
        amount: number;
        date: string;
        currency: string;
        type: string;
        line_items: Array<{
            description: string;
            amount: number;
            quantity?: number;
        }>;
    };
}

export const aiService = {
    analyzeFile: async (file: File, familyId: string): Promise<AnalysisResponse> => {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await apiClient.post(`/ai/analyze?family_id=${familyId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        
        return response.data.data as AnalysisResponse;
    }
};
