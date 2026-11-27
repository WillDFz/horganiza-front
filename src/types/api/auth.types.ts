export interface RegisterInfo {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmed_email: boolean;
}

export interface RegisterResponse {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    created_at: string;
    updated_at: string;
}

export interface CustomerRegisterInfo {
    email: string;
    business_id: string;
}


export interface CustomerLoginCredentials {
    email: string;
    url: string;
    confirmation_code: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    id: string;
    name: string;
    phone: string;
    address: string;
    email: string;
    created_at: string;
    updated_at: string;
}
export interface UserSession {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'USER' | 'CUSTOMER';
    business_id: string;
    confirmed_email: boolean;
}
export interface CustomerSession {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'CUSTOMER';
    business_id: string;
    confirmed_email: boolean;
}


export interface AuthMeResponse {
    user: UserSession;
}

export interface AuthMeCustomerResponse {
    customer: CustomerSession;
}