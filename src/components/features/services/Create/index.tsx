import { useService } from '@/hooks/useService';
import { Checkbox, InputAdornment, TextareaAutosize, TextField } from '@mui/material'
import React, { useState } from 'react'
import { CreateService as CreateServiceType, Service, UpdateService } from '@/types/api/services.types';
import { formatAmountPtBr, parseBrMoneyInput } from '@/utils/formatters/money';
import { formatDateTimeFullPtBr } from '@/utils/formatters/date';
import Button from '@/components/ui/Button';

interface CreateServiceProps {
    onSuccess?: () => void;
    onClose?: () => void;
    serviceToEdit?: Service | null;
}

const getSubmitLabel = (loading: boolean, isEditMode: boolean): string => {
    if (loading) return 'Salvando...';
    if (isEditMode) return 'Atualizar Serviço';
    return 'Criar Serviço';
};

const CreateService = ({ onSuccess, onClose, serviceToEdit }: CreateServiceProps) => {
    const { createService, updateService, loading } = useService();
    const isEditMode = !!serviceToEdit;

    const getInitialState = (service?: CreateServiceType): CreateServiceType => ({
        business_id: service?.business_id ?? '',
        name: service?.name ?? '',
        description: service?.description ?? '',
        duration: service?.duration ?? 0,
        quantity: service?.quantity ?? 0,
        image: service?.image ?? '',
        parent_id: service?.parent_id ?? '',
        has_staff: service?.has_staff ?? false,
        price: service?.price ?? 0,
        promotional_price: service?.promotional_price ?? 0,
        promotional_start_date: service?.promotional_start_date,
        promotional_end_date: service?.promotional_end_date,
    });

    const [serviceData, setServiceData] = useState<CreateServiceType>(
        () => getInitialState(serviceToEdit as CreateServiceType)
    );

    const [priceInput, setPriceInput] = useState(() =>
        serviceToEdit != null ? formatAmountPtBr(serviceToEdit.price) : ''
    );
    const [promotionPriceInput, setPromotionPriceInput] = useState(() =>
        serviceToEdit != null && (serviceToEdit.promotional_price ?? 0) > 0
            ? formatAmountPtBr(serviceToEdit.promotional_price as number)
            : ''
    );
    const [promotionalStartDateInput, setPromotionalStartDateInput] = useState(() =>
        serviceToEdit != null && (serviceToEdit.promotional_start_date ?? '')
            ? formatDateTimeFullPtBr(serviceToEdit.promotional_start_date as string)
            : ''
    );
    const [promotionalEndDateInput, setPromotionalEndDateInput] = useState(() =>
        serviceToEdit != null && (serviceToEdit.promotional_end_date ?? '')
            ? formatDateTimeFullPtBr(serviceToEdit.promotional_end_date as string)
            : ''
    );

    const promotionPriceTrimmed = promotionPriceInput.trim();
    const parsedPromotionPrice =
        promotionPriceTrimmed === '' ? 0 : parseBrMoneyInput(promotionPriceTrimmed);
    const showPromotionalPeriodFields =
        promotionPriceTrimmed !== '' &&
        Number.isFinite(parsedPromotionPrice) &&
        parsedPromotionPrice > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        if (name === 'has_staff') {
            setServiceData((prev) => ({ ...prev, has_staff: checked }));
            return;
        }
        if (name === 'duration' || name === 'quantity') {
            const num = value === '' ? 0 : Number.parseInt(value, 10);
            setServiceData((prev) => ({
                ...prev,
                [name]: Number.isFinite(num) ? num : 0,
            }));
            return;
        }
        setServiceData((prev) => ({ ...prev, [name]: value }));
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setServiceData((prev) => ({ ...prev, description: e.target.value }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const price = parseBrMoneyInput(priceInput);
        if (!Number.isFinite(price) || price < 0) {
            console.error('Preço inválido');
            return;
        }
        const promotionRaw = promotionPriceInput.trim();
        const promotional_price =
            promotionRaw === '' ? 0 : parseBrMoneyInput(promotionRaw);
        if (!Number.isFinite(promotional_price) || promotional_price < 0) {
            console.error('Preço promocional inválido');
            return;
        }

        const payload = {
            ...serviceData,
            price,
            promotional_price,
            ...(promotional_price === 0
                ? { promotional_start_date: undefined, promotional_end_date: undefined }
                : {}),
        };

        try {
            if (isEditMode && serviceToEdit?.id) {
                const updateData: UpdateService = {
                    id: serviceToEdit.id,
                    ...payload,
                };
                await updateService(updateData);
            } else {
                await createService(payload);
            }
            onSuccess?.();
            onClose?.();
        } catch (error) {
            console.error('Erro ao salvar serviço:', error);
        }
    };


    return (
        <div>
            <h1 className='text-center text-2xl font-bold mb-4'>
                {isEditMode ? 'Editar Serviço' : 'Criar Serviço'}
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className='grid grid-cols-2 gap-4'>
                    <TextField label="Nome"
                        name="name"
                        value={serviceData.name}
                        onChange={handleChange}
                        size="small"
                        slotProps={{ inputLabel: { shrink: true } }}
                        placeholder='Nome do serviço'
                        required />

                    <TextField
                        type="text"
                        label="Preço"
                        name="price"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        size="small"
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: { inputMode: 'decimal' },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">R$</InputAdornment>
                                ),
                            },
                        }}
                        placeholder="0,00"
                        required />

                    <TextField
                        type="text"
                        label="Preço Promocional"
                        name="promotion_price"
                        value={promotionPriceInput}
                        onChange={(e) => setPromotionPriceInput(e.target.value)}
                        size="small"
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: { inputMode: 'decimal' },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">R$</InputAdornment>
                                ),
                            },
                        }}
                        placeholder="0,00"
                    />

                    {showPromotionalPeriodFields && (
                        <>
                            <TextField
                                type="text"
                                label="Data de início da promoção"
                                name="promotional_start_date"
                                value={promotionalStartDateInput}
                                onChange={(e) => setPromotionalStartDateInput(e.target.value)}
                                size="small"
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                            <TextField
                                type="text"
                                label="Data de fim da promoção"
                                name="promotional_end_date"
                                value={promotionalEndDateInput}
                                onChange={(e) => setPromotionalEndDateInput(e.target.value)}
                                size="small"
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                        </>
                    )}

                    <TextField
                        type="number"
                        label="Duração (minutos)"
                        name="duration"
                        value={serviceData.duration}
                        onChange={handleChange}
                        size="small"
                        required />

                    <TextField
                        type="number"
                        label="Quantidade"
                        name="quantity"
                        value={serviceData.quantity ?? 0}
                        onChange={handleChange}
                        size="small"
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <div className='flex items-center gap-2'>
                        <label htmlFor="has_staff" className='text-sm font-medium mb-2'>Tem atendente</label>
                        <Checkbox
                            id="has_staff"
                            name="has_staff"
                            checked={serviceData.has_staff}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='mt-2'>
                    <label htmlFor="description" className='text-sm font-medium mb-2'>Descrição</label>
                    <TextareaAutosize
                        id="description"
                        name="description"
                        value={serviceData.description ?? ''}
                        onChange={handleDescriptionChange}
                        className='w-full rounded-md border border-border p-2'
                        maxLength={255}
                    />
                </div>

                <Button type="submit" loading={loading} className="mx-auto mt-3 w-full max-w-xs">
                    {getSubmitLabel(loading, isEditMode)}
                </Button>
            </form>
        </div>
    )
}

export default CreateService
