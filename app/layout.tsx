import type { PropsWithChildren } from 'react';
import '../styles/globals.css';
import { Providers } from './providers';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>{children}</Providers>;
      </body>
    </html>
  );
}
