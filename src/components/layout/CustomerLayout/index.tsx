'use client';
import React from 'react'
import CustomerRouteGuard from '@/utils/RouteGuard/Customer'


interface CustomerLayoutProps {
  business_slug: string;
  children: React.ReactNode;
}


const CustomerLayout = ({ children, business_slug }: CustomerLayoutProps) => {
  return (
    <main className="w-full min-h-screen  justify-center items-center relative overflow-hidden">
      <CustomerRouteGuard business_slug={business_slug}>{children}</CustomerRouteGuard>
    </main>
  )
}

export default CustomerLayout
