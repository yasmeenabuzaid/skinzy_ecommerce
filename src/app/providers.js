"use client"; //  <--  مهم جداً لتحويله إلى Client Component

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Providers({ children }) {
  // نستخدم useState لضمان أن الـ client يتم إنشاؤه مرة واحدة فقط
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}