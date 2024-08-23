import { ConnectedWallet } from '@privy-io/react-auth';
import {
  ENTRYPOINT_ADDRESS_V06,
  ENTRYPOINT_ADDRESS_V07,
  bundlerActions,
  createSmartAccountClient,
  walletClientToSmartAccountSigner,
} from 'permissionless';
import { signerToSimpleSmartAccount } from 'permissionless/accounts';
import { pimlicoBundlerActions } from 'permissionless/actions/pimlico';
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import {
  Chain,
  createClient,
  createPublicClient,
  http,
  createWalletClient,
  custom,
} from 'viem';

const PIMLICO_API_KEY = import.meta.env.VITE_PIMLICO_API_KEY;

export const getSmartaccountClient = async (
  wallets: ConnectedWallet[],
  selectedChain: Chain
) => {
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
  const eip1193provider = await embeddedWallet?.getEthereumProvider();

  // Create a viem WalletClient from the embedded wallet's EIP1193 provider
  // This will be used as the signer for the user's smart account
  const privyClient = createWalletClient({
    account: embeddedWallet?.address as `0x${string}`,
    chain: selectedChain, 
    transport: custom(eip1193provider as any),
  });

  const customSigner = walletClientToSmartAccountSigner(privyClient);

  // Create a viem public client for RPC calls
  const publicClient = createPublicClient({
    chain: selectedChain, // Replace this with the chain of your app
    transport: http(),
  });

  // Initialize the smart account for the user
  const simpleSmartAccount = await signerToSimpleSmartAccount(publicClient, {
    signer: customSigner,
    factoryAddress: '0x9406Cc6185a346906296840746125a0E44976454',
    entryPoint: ENTRYPOINT_ADDRESS_V06,
  });

  const chainNames = {
    1: "ethereum",
    8453: "base",
    11155111: "sepolia",
    84532: "base-sepolia"
  }

  const transportHttp = `https://api.pimlico.io/v2/${chainNames[selectedChain.id]}/rpc?apikey=${PIMLICO_API_KEY}`

  // Create the Paymaster for gas sponsorship using the API key from your Pimlico dashboard
  const pimlicoPaymaster = createPimlicoPaymasterClient({
    transport: http(transportHttp),
    entryPoint: ENTRYPOINT_ADDRESS_V06,
  });

  const pimlicoBundlerClient = createClient({
    chain: selectedChain,
    transport: http(transportHttp),
  })
    .extend(bundlerActions(ENTRYPOINT_ADDRESS_V07))
    .extend(pimlicoBundlerActions(ENTRYPOINT_ADDRESS_V07));

  // Create the SmartAccountClient for requesting signatures and transactions (RPCs)
  const smartAccountClient = createSmartAccountClient({
    account: simpleSmartAccount as any,
    chain: selectedChain,
    bundlerTransport: http(transportHttp),
    middleware: {
      gasPrice: async () => (await pimlicoBundlerClient.getUserOperationGasPrice()).fast, // use pimlico bundler to get gas prices, if using pimlico
      sponsorUserOperation: pimlicoPaymaster.sponsorUserOperation as any, // optional parameters
    },
  });

  return smartAccountClient;
};