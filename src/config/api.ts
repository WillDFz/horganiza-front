import axios, { AxiosInstance } from 'axios';
export class ApiService {
    private static axiosInstance: AxiosInstance;

    private constructor() {
        // Constructor is private to prevent direct instantiation
    }

    private static initializeInstance(): void {
        ApiService.axiosInstance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            withCredentials: true,
        });
    }

    public static getInstance(): AxiosInstance {
        if (!ApiService.axiosInstance) {
            ApiService.initializeInstance();
        }
        return ApiService.axiosInstance;
    }
}