import apiClient from "@/lib/axios";
import { Attachment } from "@/types";

export const attachmentService = {
    getAttachmentById: async (id: string) => {
        const response = await apiClient.get(`/attachments/${id}`);
        return response.data as Attachment;
    },
    getAttachmentsByEntity: async (type: string, id: string) => {
        const response = await apiClient.get(`/attachments?type=${type}&id=${id}`);
        return response.data as Attachment[];
    }
};
