'use client';

import { useCallback, useEffect, useState } from 'react';
import { useBusiness } from '@/hooks/useBusiness';
import { BusinessInfo } from '@/types/api/business.types';

export function useCustomerBusinessInfo(business_slug: string) {
    const { getBusinessBySlug, loading, error } = useBusiness();
    const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);

    const loadBusinessInfo = useCallback(async (): Promise<BusinessInfo | null> => {
        try {
            const business = await getBusinessBySlug(business_slug);
            if (!business) {
                throw new Error('Negócio não encontrado');
            }
            setBusinessInfo(business);
            return business;
        } catch {
            throw new Error('Erro ao carregar dados do negócio');
        }
    }, [getBusinessBySlug, business_slug]);

    useEffect(() => {
        queueMicrotask(() => {
            void loadBusinessInfo();
        });
    }, [loadBusinessInfo]);

    return { businessInfo, loading, error };
}
