import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

function App() {
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState('0');

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("MetaMask not detected");
    }
  };

  // Fetch ETH balance
  const fetchBalance = async () => {
    if (!window.ethereum || !account) return;
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    setEthBalance(ethers.utils.formatEther(balance));
  };

  // Convert ETH to WETH
  const convertToWETH = async () => {
    if (!window.ethereum || !account) {
      alert("Connect your wallet first!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const wethContractAddress = "YOUR_WETH_CONTRACT_ADDRESS"; // Replace with your WETH contract address
    const wethABI = [
      "function deposit() public payable",
      "function withdraw(uint wad) public"
    ];

    const wethContract = new ethers.Contract(wethContractAddress, wethABI, signer);

    try {
      const tx = await wethContract.deposit({ value: ethers.utils.parseEther(amount) });
      await tx.wait();
      alert("Converted ETH to WETH successfully!");
      fetchBalance(); // Refresh balance after conversion
    } catch (error) {
      console.error("Error converting to WETH", error);
    }
  };

  // Convert WETH to ETH
  const convertToETH = async () => {
    if (!window.ethereum || !account) {
      alert("Connect your wallet first!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const wethContractAddress = "YOUR_WETH_CONTRACT_ADDRESS"; // Replace with your WETH contract address
    const wethABI = [
      "function deposit() public payable",
      "function withdraw(uint wad) public"
    ];

    const wethContract = new ethers.Contract(wethContractAddress, wethABI, signer);

    try {
      const tx = await wethContract.withdraw(ethers.utils.parseEther(amount));
      await tx.wait();
      alert("Converted WETH to ETH successfully!");
      fetchBalance(); // Refresh balance after conversion
    } catch (error) {
      console.error("Error converting to ETH", error);
    }
  };

  useEffect(() => {
    if (account) {
      fetchBalance();
    }
  }, [account]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>ETH to WETH Converter</h1>

      {!account && (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}

      {account && (
        <div className="container">
        <p>Connected account: {account}</p>
        <p>ETH Balance: {ethBalance} ETH</p>
  
        <div className="input-container">
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
  
          <button onClick={convertToWETH}>
            Convert ETH to WETH
          </button>
  
          <button onClick={convertToETH}>
            Convert WETH to ETH
          </button>
        </div>
      </div>
      )}
    </div>
  );
}

export default App;
