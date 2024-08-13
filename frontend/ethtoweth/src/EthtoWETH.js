import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { EthtoWETHABI } from './abi'; // Ensure this points to the correct ABI file
import { connectMetamask } from './connectMetamask'; // Ensure this utility connects MetaMask properly

const EthtoWETHContext = createContext();

export const EthtoWETHProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [ethToWETHContract, setEthToWETHContract] = useState(null);
  const [wethBalance, setWethBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [account, setAccount] = useState('');

  const contractAddress = '0xE39C855Ef6C10c92DAbB5a21c8B2c5FFdC6dD22d'; // Replace with your WETH contract address

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
      }
    } catch (error) {
      console.error('Error converting ETH to WETH:', error);
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
      }
    } catch (error) {
      console.error('Error withdrawing WETH:', error);
    }
  };

  return (
    <EthtoWETHContext.Provider value={{ convertETHToWETH, withdrawWETH, wethBalance, ethBalance, account, connectWallet: connectMetamask }}>
      {children}
    </EthtoWETHContext.Provider>
  );
};

export const useEthtoWETH = () => useContext(EthtoWETHContext);
