'use client';

import { Auth0Provider as SDKProvider } from '@auth0/nextjs-auth0/client';

export default function Auth0Provider({ children }: { children: React.ReactNode }) {
  return (
    <SDKProvider>
      {children}
    </SDKProvider>
  );
}
