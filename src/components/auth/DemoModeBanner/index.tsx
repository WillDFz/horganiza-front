'use client';

import React from 'react';
import { DEMO_BUSINESS_SLUG } from '@/mocks/constants';

const envDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export function isDemoMode(businessSlug?: string): boolean {
  if (envDemoMode) {
    return true;
  }
  if (businessSlug && businessSlug === DEMO_BUSINESS_SLUG) {
    return true;
  }
  return false;
}

interface DemoModeBannerProps {
  children: React.ReactNode;
  businessSlug?: string;
}

const DemoModeBanner = ({ children, businessSlug }: DemoModeBannerProps) => {
  if (!isDemoMode(businessSlug)) {
    return null;
  }

  return (
    <div
      className="mb-4 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-xs text-teal-900"
      data-testid="demo-credentials-banner"
    >
      <p className="font-semibold">Modo demo</p>
      {children}
    </div>
  );
};

export default DemoModeBanner;
