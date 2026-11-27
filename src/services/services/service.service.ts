import { CreateService, Service, UpdateService } from "@/types/api/services.types";
import { BaseService } from "../base.service";
import { AxiosError } from "axios";

export default class ServicesService extends BaseService {
    constructor() {
        super();
    }

    async createService(service: CreateService): Promise<Service> {
        try {
            const response = await this.api.post('/service', service);

            return response.data.service;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message as string);
            }
            throw new Error('Failed to create service');
        }
    }

    async getServices(q?: string): Promise<Service[]> {
        try {
            const response = await this.api.get(`/service/list`, { params: { q } });
            return response.data.services;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message as string);
            }
            throw new Error('Failed to get services');
        }
    }

    async deleteService(id: string): Promise<void> {
        try {
            const response = await this.api.delete(`/service/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message as string);
            }
            throw new Error('Failed to delete service');
        }
        
    }

    async updateService(service: UpdateService): Promise<Service> {
        try {
            const response = await this.api.put(`/service/${service.id}`, service);
            return response.data.service;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message as string);
            }
            throw new Error('Failed to update service');
        }
    }
}