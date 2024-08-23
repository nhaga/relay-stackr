import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { config } from './config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {PrivyProvider} from '@privy-io/react-auth';

import '@rainbow-me/rainbowkit/styles.css';
import './index.css'

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

import App from './App.tsx'

const queryClient = new QueryClient()


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
    <RainbowKitProvider>
    <PrivyProvider
      appId={import.meta.env.VITE_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
        <App />
    </PrivyProvider>      
    </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
