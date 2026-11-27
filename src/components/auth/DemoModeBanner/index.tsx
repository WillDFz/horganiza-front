'use client';

import React from 'react';

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

interface DemoModeBannerProps {
  children: React.ReactNode;
}

const DemoModeBanner = ({ children }: DemoModeBannerProps) => {
  if (!isDemoMode) {
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
export { isDemoMode };
