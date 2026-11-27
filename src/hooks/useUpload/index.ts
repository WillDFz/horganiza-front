import { UploadService } from "@/services/upload/upload.service";
import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";


export const useUpload = () => {
    const uploadService = useMemo(() => new UploadService(), []);

    const uploadFile = useCallback(async (file: File) => {
    
        try {
            const response = await uploadService.uploadFile(file);
            toast.success('Arquivo enviado com sucesso');
            return response;
        } catch (error) {
            toast.error('Erro ao fazer upload do arquivo');
            throw error;
        }
    }, [uploadService]);

    return { uploadFile };
}
