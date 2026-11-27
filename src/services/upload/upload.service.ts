import { BaseService } from "../base.service";

interface UploadApiResponse {
    url: string;
    path: string;
}

export class UploadService extends BaseService {
    constructor() {
        super();
    }

    async uploadFile(file: File): Promise<string> {
        const formData = new FormData();
        formData.append("image", file);

        const response = await this.api.post<UploadApiResponse>("/upload", formData);

        if (response.status < 200 || response.status >= 300) {
            throw new Error("Failed to upload file");
        }

        const { url } = response.data;
        if (typeof url !== "string" || !url) {
            throw new Error("Invalid upload response");
        }
        return url;
    }
}