import apiClient from "@/lib/axios";

export interface AnalysisResponse {
    filename: string;
    analysis: {
        category: string;
        confidence: number;
        description: string;
        tags: string[];
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
