import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Tenta mais uma vez se falhar pela rede
      refetchOnWindowFocus: false, // Menos chamadas na API ao mudar de aba
      staleTime: 5 * 60 * 1000, // Dados expiram em 5 minutos
    },
  },
});

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
