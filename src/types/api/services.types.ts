export interface Service {
    id: string;
    name: string;
    description?: string;
    price: number;
    business_id: string;
    promotional_price?: number;
    promotional_start_date?: string | null;
    promotional_end_date?: string | null;
    has_staff: boolean;
    duration: number;
    quantity?: number;
    image?: string;
    parent_id: string;
    created_at: string;
    updated_at: string;
}

export interface CreateService {
    business_id: string;
    name: string;
    description?: string;
    price: number;
    promotional_price?: number;
    promotional_start_date?: string;
    promotional_end_date?: string;
    has_staff: boolean;
    duration: number;
    quantity?: number;
    image?: string;
    parent_id: string;
}

export type UpdateService = Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>> & {
    id: string;
    business_id: string;
};