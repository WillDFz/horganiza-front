'use client';
import { Service } from '@/types/api/services.types';
import { DeleteOutline, Edit } from '@mui/icons-material';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

interface ServiceCardProps {
    service: Service;
    onDelete: (service: Service) => void;
    onEdit: (service: Service) => void;
}

const ServiceCard = ({ service, onDelete, onEdit }: ServiceCardProps) => {
    const promotionalPrice = service.promotional_price ?? 0;
    const hasPromotionalPrice = promotionalPrice > 0;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    const formatDuration = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    };

    return (
        <Card className="relative transition-shadow hover:shadow-lg">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-foreground">{service.name}</h2>
                        {hasPromotionalPrice ? (
                            <Badge variant="warning">Promoção</Badge>
                        ) : null}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(service)}
                            className="text-primary transition-colors hover:text-primary-600"
                            aria-label="Editar serviço"
                        >
                            <Edit />
                        </button>
                        <button
                            onClick={() => onDelete(service)}
                            className="text-primary-dark transition-colors hover:text-primary-400"
                            aria-label="Excluir serviço"
                        >
                            <DeleteOutline />
                        </button>
                    </div>
                </div>

                {service.description ? (
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                ) : null}

                <div className="mt-2 flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Preço</span>
                        <div className="flex items-center gap-2">
                            {hasPromotionalPrice ? (
                                <>
                                    <span className="text-lg font-bold text-primary">
                                        {formatPrice(promotionalPrice)}
                                    </span>
                                    <span className="text-sm text-muted-foreground line-through">
                                        {formatPrice(service.price)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-lg font-bold text-foreground">
                                    {formatPrice(service.price)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Duração</span>
                        <span className="text-sm font-medium text-foreground">
                            {formatDuration(service.duration)}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ServiceCard;
