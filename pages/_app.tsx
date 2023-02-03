import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { Layout } from '../src/components/Layout';
import { UserProvider } from '../src/hooks/UserProvider';
import '../styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const isDev = process.env.NODE_ENV === 'development';
const isReactQueryDevToolEnabled: boolean = isDev && false;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Twitter</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        {isReactQueryDevToolEnabled && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
        <UserProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserProvider>
        <Toaster position="bottom-right" gutter={8} />
      </QueryClientProvider>
    </>
  );
}
