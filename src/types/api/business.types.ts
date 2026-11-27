export interface Business {
    id: string;
    business_id: string;
    name: string;
    pix_key?: string;
    url: string;
    interval_minutes: number;
    primary_color: string;
    secondary_color: string;
    contact_email: string;
    phone: string;
    instagram_url: string;
    facebook_url: string;
    logo: string;
    created_at: string;
    updated_at: string;
}

export interface BusinessInfo {
    id: string;
    business_id: string;
    name: string;
    logo: string;
}

export interface CreateBusiness {
    name: string;
    business_id: string;
    url: string;
    interval_minutes: number | null;
    primary_color: string;
    secondary_color: string;
    contact_email?: string;
    phone?: string;
    instagram_url?: string;
    facebook_url?: string;
    logo?: string;
}