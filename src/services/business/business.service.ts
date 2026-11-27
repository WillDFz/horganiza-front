import { BaseService } from "../base.service";
import { Business } from "@/types/api/business.types";

export default class BusinessService extends BaseService {
    constructor() {
        super();
    }

    async getBusiness(): Promise<Business> {
        try {
            const response = await this.api.get(`/business`);
            if (response.status !== 200) {
                throw new Error('Failed to get business');
            }
            return response.data.business;
        } catch {
            throw new Error('Failed to get business');
        }
    }

    async getBusinessBySlug(slug: string): Promise<Business> {
        try {
            const response = await this.api.get(`/business/${slug}`);

            if (response.status === 404) {
                throw new Error('Negócio não encontrado');
            }
            if (response.status !== 200) {
                throw new Error('Erro ao carregar dados do negócio');
            }
            return response.data.business;
        } catch {
            throw new Error('Erro ao carregar dados do negócio');
        }
    }

    async updateBusiness(business: Business): Promise<Business> {
        try {
            const response = await this.api.put(`/business`, business);
            if (response.status !== 200) {
                throw new Error('Failed to update business');
            }
            return response.data.business;
        } catch {
            throw new Error('Failed to update business');
        }
    }

}