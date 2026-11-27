'use client';
import { useState, useEffect, useCallback } from 'react';
import { useBusiness } from '@/hooks/useBusiness';
import { Business } from '@/types/api/business.types';
import { Tab, Tabs, TextField } from '@mui/material';
import ImageUpload from '@/components/ui/ImageUpload';
import ColorPicker from '@/components/ui/ColorPicker';
import TabContainer from '@/components/ui/TabContainer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingState from '@/components/ui/LoadingState';
import BusinessPublicLink from '../BusinessPublicLink';
import { useUpload } from '@/hooks/useUpload';
import { dataUrlToFile } from '@/utils/formatters/dataUrlToFile';
import { formatPhoneBR, stripPhoneDigits } from '@/utils/formatters/phoneBr';

const emptyBusiness = (): Business => ({
    id: '',
    business_id: '',
    name: '',
    url: '',
    interval_minutes: 0,
    primary_color: '',
    secondary_color: '',
    contact_email: '',
    phone: '',
    instagram_url: '',
    facebook_url: '',
    logo: '',
    created_at: '',
    updated_at: '',
});

const TAB_LABELS = [
    { value: 0, label: 'Identidade' },
    { value: 1, label: 'Contato' },
    { value: 2, label: 'Agendamento' },
] as const;

const InfoForm = () => {
    const { getBusiness, business, loading, updateBusiness } = useBusiness();
    const { uploadFile } = useUpload();

    const [businessData, setBusinessData] = useState<Business>(business ?? emptyBusiness());
    const [activeTab, setActiveTab] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setBusinessData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const handlePrimaryColorChange = useCallback((color: string) => {
        setBusinessData((prev) => ({ ...prev, primary_color: color }));
    }, []);

    const handleSecondaryColorChange = useCallback((color: string) => {
        setBusinessData((prev) => ({ ...prev, secondary_color: color }));
    }, []);

    const handleLogoChange = useCallback((logo: string) => {
        setBusinessData((prev) => ({ ...prev, logo }));
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const logo = businessData.logo;
        setIsSubmitting(true);
        try {
            let payload = businessData;
            if (logo?.startsWith('data:')) {
                const file = dataUrlToFile(businessData.logo, 'logo.png');
                const uploadedUrl = await uploadFile(file);
                payload = { ...businessData, logo: uploadedUrl };
                setBusinessData(payload);
            }
            await updateBusiness(payload);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        getBusiness();
    }, [getBusiness]);

    useEffect(() => {
        queueMicrotask(() => {
            if (business) {
                setBusinessData(business);
            }
        });
    }, [business]);

    if (loading) {
        return (
            <Card padding="lg">
                <LoadingState />
            </Card>
        );
    }

    return (
        <Card padding="lg">
            <BusinessPublicLink slug={businessData.url ?? ''} />

            <div className="border-b border-border">
                <Tabs
                    value={activeTab}
                    onChange={(_e, value) => setActiveTab(value)}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {TAB_LABELS.map(({ value, label }) => (
                        <Tab key={value} value={value} label={label} />
                    ))}
                </Tabs>
            </div>

            <form className="mt-8 flex flex-col gap-8" onSubmit={handleSubmit}>
                <TabContainer value={activeTab} index={0} key="business-information">
                    <div className="flex flex-col gap-8">
                        <section className="flex flex-col gap-4">
                            <div>
                                <h2 className="text-base font-semibold text-foreground">
                                    Informações do negócio
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Nome e endereço público usados na página de agendamento.
                                </p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <TextField
                                    label="Nome do Negócio"
                                    name="name"
                                    value={businessData.name}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                />
                                <TextField
                                    label="URL do Negócio"
                                    name="url"
                                    value={businessData.url}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    helperText={
                                        businessData.url
                                            ? `horganiza.com/business/${businessData.url}`
                                            : 'Slug único para a página pública'
                                    }
                                />
                            </div>
                        </section>

                        <section className="flex flex-col gap-4">
                            <div>
                                <h2 className="text-base font-semibold text-foreground">
                                    Identidade visual
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Cores e logo exibidos para os clientes na página de agendamento.
                                </p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 md:items-start">
                                <div className="flex flex-col gap-4">
                                    <ColorPicker
                                        label="Cor primária"
                                        value={businessData.primary_color ?? ''}
                                        onChange={handlePrimaryColorChange}
                                    />
                                    <ColorPicker
                                        label="Cor secundária"
                                        value={businessData.secondary_color ?? ''}
                                        onChange={handleSecondaryColorChange}
                                    />
                                </div>
                                <ImageUpload
                                    label="Logo do negócio"
                                    value={businessData.logo ?? ''}
                                    onChange={handleLogoChange}
                                    maxSizeMB={5}
                                    previewHeight="max-h-64"
                                />
                            </div>
                        </section>
                    </div>
                </TabContainer>

                <TabContainer value={activeTab} index={1} key="business-contact">
                    <section className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">Canais de contato</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Informações opcionais para clientes entrarem em contato.
                            </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <TextField
                                label="Email de Contato"
                                name="contact_email"
                                value={businessData.contact_email ?? ''}
                                onChange={handleChange}
                                type="email"
                                fullWidth
                                variant="outlined"
                                size="small"
                            />
                            <TextField
                                label="Telefone de Contato"
                                name="phone"
                                value={formatPhoneBR(businessData.phone ?? '')}
                                onChange={(e) =>
                                    setBusinessData({
                                        ...businessData,
                                        phone: stripPhoneDigits(e.target.value),
                                    })
                                }
                                fullWidth
                                variant="outlined"
                                size="small"
                                slotProps={{
                                    htmlInput: { inputMode: 'numeric', autoComplete: 'tel-national' },
                                }}
                                placeholder="(11) 98765-4321"
                            />
                            <TextField
                                label="URL do Instagram"
                                name="instagram_url"
                                value={businessData.instagram_url ?? ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="https://instagram.com/seu-negocio"
                            />
                            <TextField
                                label="URL do Facebook"
                                name="facebook_url"
                                value={businessData.facebook_url ?? ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="https://facebook.com/seu-negocio"
                            />
                        </div>
                    </section>
                </TabContainer>

                <TabContainer value={activeTab} index={2} key="business-appointment">
                    <section className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                Configurações de agendamento
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Define o intervalo mínimo entre horários disponíveis no calendário.
                            </p>
                        </div>
                        <TextField
                            label="Intervalo de agendamento (minutos)"
                            name="interval_minutes"
                            value={businessData.interval_minutes ?? ''}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            size="small"
                            type="number"
                            slotProps={{ htmlInput: { min: 5, step: 5 } }}
                            helperText="Ex.: 30 minutos entre cada horário disponível"
                        />
                    </section>
                </TabContainer>

                <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        As alterações são refletidas na página pública do negócio.
                    </p>
                    <Button
                        type="submit"
                        loading={isSubmitting}
                        disabled={loading}
                        className="w-full sm:w-auto sm:min-w-[160px]"
                    >
                        Salvar alterações
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default InfoForm;
