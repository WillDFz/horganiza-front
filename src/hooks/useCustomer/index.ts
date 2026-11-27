import { useCallback, useMemo, useState } from "react";
import AuthService from "@/services/auth/auth.service";
import CustomerService from "@/services/customer/customer.service";
import { CustomerLoginCredentials } from "@/types/api/auth.types";
import { toast } from "react-toastify";


export const useCustomer = () => {
    const authService = useMemo(() => new AuthService(), []);
    const customerService = useMemo(() => new CustomerService(), []);
    const [loading, setLoading] = useState<boolean>(false);

    const verifyCode = useCallback(async (credentials: CustomerLoginCredentials) => {
        setLoading(true);
        try {
            const response = await authService.verifyCode(credentials);
            return response;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao verificar código de confirmação");
            return false;
        } finally {
            setLoading(false);
        }
    }, [authService]);

    const requestConfirmationCode = useCallback(async (email: string, business_slug: string) => {
        setLoading(true);
        try {
            const response = await authService.requestConfirmationCode(email, business_slug);
            return response;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao solicitar código de confirmação");
            return false;
        } finally {
            setLoading(false);
        }
    }, [authService]);

    const getCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await customerService.getCustomers();

            return response;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao carregar clientes");
            return [];
        } finally {
            setLoading(false);
        }
    }, [customerService]);

    return { loading, requestConfirmationCode, verifyCode, getCustomers, };
};