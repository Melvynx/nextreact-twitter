'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { Component } from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout } from '~/components/Layout';
import { UserProvider } from '~/hooks/UserProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Layout>{children}</Layout>
      </UserProvider>
      <Toaster position="bottom-right" gutter={8} />
    </QueryClientProvider>
  );
};
