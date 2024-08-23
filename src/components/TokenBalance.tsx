import { createPublicClient, http, formatEther, erc20Abi } from 'viem'
import { baseSepolia, sepolia } from 'viem/chains'
import { useCallback, useState, useEffect } from 'react'
import { useBlockNumber  } from 'wagmi'

const chainProviders = {
    11155111: sepolia,
    84532: baseSepolia
}


const tokenAddresses = {
    11155111: "0xfF36224B9CF97e7791D99fE19281Ff78B0b24208",
    84532: "0x7B7aA5dbd3c4DF9f64871470a8585B80986C8C48"
}


function TokenBalance({address, chainId}: {address: `0x${string}`, chainId: number}) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [ balance, setBalance] = useState<string>()
    const {data: blockNumber} = useBlockNumber({watch: true})


    const chain = chainProviders[chainId] 
    
    const publicClient  = createPublicClient({ 
        chain: chain, 
        transport: http() 
      }) 

      const refreshBalance = useCallback(async () => {
        setIsLoading(true)
        setBalance(
          formatEther(await publicClient.readContract({
            address: tokenAddresses[chainId],
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address]
          }))
      )   
      setIsLoading(false)

      }, [address])

      useEffect(() => {
        refreshBalance()
        
      }, [blockNumber, address])



  return (
    <div className="flex items-end justify-center hover:bg-gray-50 py-2 cursor-pointer">
      { isLoading ? 
      <div className="animate-pulse bg-gray-200 rounded w-40 h-14 mx-2"></div>
      :
    <div className="text-6xl font-bold px-2">
        {(+balance).toFixed(4)}
    </div>

      }
    <div>
        <div className="text-sm text-gray-400 font-bold">OMI</div>
        <div className="text-xs text-gray-300">{chain.name}</div>
    </div>
  </div>
)
}

export default TokenBalance