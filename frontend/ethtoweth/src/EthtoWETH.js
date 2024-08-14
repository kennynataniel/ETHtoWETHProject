import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { EthtoWETHABI } from './abi';
import { connectMetamask } from './connectMetamask';

const EthtoWETHContext = createContext();

export const EthtoWETHProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [ethToWETHContract, setEthToWETHContract] = useState(null);
  const [wethBalance, setWethBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [account, setAccount] = useState('');
  const [error, setError] = useState(''); // Error state

  const contractAddress = '0xE39C855Ef6C10c92DAbB5a21c8B2c5FFdC6dD22d';

  useEffect(() => {
    const init = async () => {
      try {
        const { address, balance } = await connectMetamask();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const ethToWETHContract = new ethers.Contract(contractAddress, EthtoWETHABI, signer);

        setProvider(provider);
        setSigner(signer);
        setAccount(address);
        setEthBalance(ethers.utils.formatEther(balance));
        setEthToWETHContract(ethToWETHContract);

        const wethBalance = await ethToWETHContract.balanceOf(address);
        setWethBalance(ethers.utils.formatEther(wethBalance));
      } catch (error) {
        console.error('Error initializing contract:', error);
        setError('Failed to initialize the contract.');
      }
    };

    init();
  }, [contractAddress]);

  const convertETHToWETH = async (ethAmount) => {
    try {
      if (ethToWETHContract) {
        const tx = await ethToWETHContract.convertWETH({ value: ethers.utils.parseEther(ethAmount) });
        await tx.wait();
        const updatedWethBalance = await ethToWETHContract.balanceOf(account);
        setWethBalance(ethers.utils.formatEther(updatedWethBalance));
        setError(''); // Clear any previous errors
      }
    } catch (error) {
      console.error('Error converting ETH to WETH:', error);
      setError('Error converting ETH to WETH: ' + error.message);
    }
  };

  const withdrawWETH = async (wethAmount) => {
    try {
      if (ethToWETHContract) {
        const tx = await ethToWETHContract.withdrawWETH(ethers.utils.parseEther(wethAmount));
        await tx.wait();
        const updatedWethBalance = await ethToWETHContract.balanceOf(account);
        setWethBalance(ethers.utils.formatEther(updatedWethBalance));

        const updatedEthBalance = await provider.getBalance(account);
        setEthBalance(ethers.utils.formatEther(updatedEthBalance));
        setError(''); // Clear any previous errors
      }
    } catch (error) {
      console.error('Error withdrawing WETH:', error);

      const revertMessage = error?.error?.data?.message
        ? error.error.data.message
        : error.message;

      // Extracting just the "execution reverted: ..." portion
      const match = revertMessage.match(/execution reverted: (.*)/);
      if (match) {
        setError(match[0]); // Set the specific error message
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };


  return (
    <EthtoWETHContext.Provider value={{ convertETHToWETH, withdrawWETH, wethBalance, ethBalance, account, connectWallet: connectMetamask, error }}>
      {children}
    </EthtoWETHContext.Provider>
  );
};

export const useEthtoWETH = () => useContext(EthtoWETHContext);
