import { PublicKey } from "@solana/web3.js";

export const getSolanaProvider = () => {
    if ('phantom' in window) {
        const provider = (window as any).phantom?.solana;
    
        if (provider?.isPhantom) {
            return provider;
        }
    }
    return null;
}

export const connectSolana = async () : Promise<PublicKey | null> => {
    const provider = getSolanaProvider();
    try {
        const { publicKey } = await provider.connect();
        console.log("Wallet connected", publicKey.toString())
        return publicKey;
    } catch (e) {
        console.log("User rejected the request!", e)
        return null;
    }
}