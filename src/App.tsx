import Relay from './components/Relay'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import TokenBalance from "./components/TokenBalance"
import Auth from './components/Auth.tsx'
import { useAccount } from 'wagmi';

function App() {
  // const {address} = useAccount()
  const address = "0xDC214AE9e4a78e351d95eE34818D4B2D6488335b"

  return (
    <div className="p-10">
      <ConnectButton />
      <Auth />


      <h1 className="mt-20 text-2xl font-bold">Relay Bridge</h1>
      <div className="flex">
        <TokenBalance address={address as `0x${string}`} chainId={11155111} />
        <TokenBalance address={address as `0x${string}`} chainId={84532} />

      </div>
      <Relay />
    </div>
  )
}

export default App
