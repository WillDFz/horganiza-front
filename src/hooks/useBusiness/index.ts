import BusinessService from "@/services/business/business.service";
import { Business } from "@/types/api/business.types";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

export const useBusiness = () => {
    const businessService = useMemo(() => new BusinessService(), []);

    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getBusiness = useCallback(async () => {
        setLoading(true);
        try {
            const data = await businessService.getBusiness();
            setBusiness(data);

            return data;
        } catch (error) {
            toast.error('Erro ao carregar dados do negócio');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [businessService]);

    const getBusinessBySlug = useCallback(async (slug: string) => {
        setLoading(true);
        try {
            const data = await businessService.getBusinessBySlug(slug);
            return data;
        } catch (error) {
            toast.error('Erro ao carregar dados do negócio');
            setError(error instanceof Error ? error.message : 'Erro ao carregar dados do negócio');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [businessService]);

    const updateBusiness = useCallback(async (business: Business) => {
        setLoading(true);
        try {
            const data = await businessService.updateBusiness(business);
            setBusiness(data);
            toast.success('Dados do negócio salvos com sucesso');
            return data;
        } catch (error) {
            toast.error('Erro ao atualizar dados do negócio');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [businessService]);


    return { getBusiness, business, loading, updateBusiness, getBusinessBySlug, error };
}