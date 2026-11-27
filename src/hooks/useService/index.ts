import ServicesService from "@/services/services/service.service";
import { CreateService, Service, UpdateService } from "@/types/api/services.types";
import { isUnauthorizedError } from "@/utils/api/isUnauthorizedError";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

export const useService = () => {
    const servicesService = useMemo(() => new ServicesService(), []);

    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getServices = useCallback(async (query?: string) => {
        setLoading(true);
        try {
            const data = await servicesService.getServices(query);
            setServices(data);
            return data;
        } catch (error) {
            if (!isUnauthorizedError(error)) {
                toast.error(error instanceof Error ? error.message : 'Erro ao carregar os serviços');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, [servicesService]);

    const createService = useCallback(async (service: CreateService) => {
        setLoading(true);
        try {
            const data = await servicesService.createService(service);
            setServices((prevServices) => [...prevServices, data]);
            toast.success('Serviço criado com sucesso');
            return data;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao criar o serviço');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [servicesService]);

    const deleteService = useCallback(async (id: string) => {
        setLoading(true);
        try {
            await servicesService.deleteService(id);
            setServices((prevServices) => prevServices.filter((service) => service.id !== id));
            toast.success('Serviço excluído com sucesso');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao excluir o serviço');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [servicesService]);

    const updateService = useCallback(async (service: UpdateService) => {
        setLoading(true);
        try {
            const data = await servicesService.updateService(service);
            setServices((prevServices) =>
                prevServices.map((s) => s.id === service.id ? data : s)
            );
            toast.success('Serviço atualizado com sucesso');
            return data;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao atualizar o serviço');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [servicesService]);

    return { getServices, createService, updateService, deleteService, services, loading };
}