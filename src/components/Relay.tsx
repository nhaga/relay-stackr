import { useState } from 'react';
import axios from 'axios';

import { baseSepolia } from 'viem/chains'
import { useAccount } from 'wagmi';
import { getSmartaccountClient } from "../services/pimlico"
import { useWallets } from '@privy-io/react-auth';

function Relay() {
  const [txHash, setTxHash] = useState('')
  const [status, setStatus] = useState('none')

    const {chain} = useAccount()
    const {wallets} = useWallets()    

    const bridge = async () => {

      if (chain) {
        setStatus("")        
        // 1. Get SmartAccount
        const smartAccountClient = await getSmartaccountClient(wallets, chain)

        const smartAccountAddress = smartAccountClient.account.address

        // 2. Get Quote
        const payload = {
          'user': smartAccountAddress,
          'recipient': smartAccountAddress,
          'originChainId': 11155111,
          'destinationChainId': 84532,
          'currency': 'omi',
          'amount': '1000000000000000000'
        }
  
        const { data } = await axios.post(
          "https://api.testnets.relay.link/execute/bridge",
          payload,
        )  
        console.log(data)
        const txnData = data.steps[0].items[0].data
        const statusUrl = data.steps[0].items[0].check.endpoint
        console.log(txnData)

        function checkStatus() {
          axios.get(`https://api.testnets.relay.link${statusUrl}`)
            .then(response => {
              setStatus(response.data?.status)
              if (response.data.status === "success") {
                console.log("Success! Stopping requests.");
                clearInterval(intervalId);
              } else {
                console.log("Status not success yet. Trying again in 5 seconds.");
              }
            })
            .catch(error => {
              console.error("Error making request:", error.message);
            });
        }
        
        const intervalId = setInterval(checkStatus, 5000);            

        const hash = await smartAccountClient.sendTransaction({
          account: smartAccountClient.account!,
          to: txnData.to,
          chain: baseSepolia,
          value: 0n,
          data: txnData.data,
      });
      console.log("SmartAccount Address", smartAccountClient.account.address)
      setTxHash(hash)

      console.log(txHash)
      }
    }

  return (
    <>
    <div className="space-x-2">
    <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => bridge()}>Bridge</button>
    { txHash && <a target="_blank" href={`https://sepolia.etherscan.io/tx/${txHash}`}>link</a>}

    <div>{status}</div>

    </div>
    </>
  )
}

export default Relay