'use client'; 
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// ❌ تم حذف: import { ThemeProvider } from 'next-themes'; 
import { CartContextProvider } from '@/context/CartContext';
import { NextIntlClientProvider } from 'next-intl';

export default function Providers({ children, locale, messages }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
        <NextIntlClientProvider locale={locale} messages={messages}>
            <CartContextProvider>
                {children} 
            </CartContextProvider>
        </NextIntlClientProvider>
    </QueryClientProvider>
  );
}