import { ethers } from 'ethers';

export const connectMetamask = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      const signer = provider.getSigner();
      const accountAddress = await signer.getAddress();
      const balance = await provider.getBalance(accountAddress);

      return {
        address: accountAddress,
        balance: balance,
      };
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  } else {
    alert('Please Install MetaMask');
  }
};
