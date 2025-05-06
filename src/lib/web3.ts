import { ethers } from 'ethers';

export async function createWallet(): Promise<string> {
  const wallet = ethers.Wallet.createRandom();
  return wallet.address;
}

export async function connectMetaMask(): Promise<string | null> {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      return null;
    }
  } else {
    console.error('MetaMask is not installed');
    return null;
  }
}

export async function sendTransaction(toAddress: string, amount: string): Promise<boolean> {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount)
      });

      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error sending transaction:', error);
      return false;
    }
  }
  return false;
}