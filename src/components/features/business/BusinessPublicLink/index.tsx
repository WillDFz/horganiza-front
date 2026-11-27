'use client';

import Link from 'next/link';
import { OpenInNewOutlined } from '@mui/icons-material';
import Button from '@/components/ui/Button';

interface BusinessPublicLinkProps {
    slug: string;
}

const BusinessPublicLink = ({ slug }: BusinessPublicLinkProps) => {
    const trimmedSlug = slug.trim();
    const publicPath = trimmedSlug ? `/business/${trimmedSlug}` : null;

    return (
        <>
       
            {publicPath ? (
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    
                    <Link href={publicPath} target="_blank" rel="noopener noreferrer">
                        <Button
                            variant="secondary"
                            className="w-full sm:w-auto"
                            icon={<OpenInNewOutlined fontSize="small" />}
                        >
                            Ver página pública
                        </Button>
                    </Link>
                </div>
            ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                    Defina a URL do negócio na aba Identidade para gerar o link da página pública.
                </p>
            )}
        </>
    );
};

export default BusinessPublicLink;
