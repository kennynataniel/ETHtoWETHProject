import React, { useState } from 'react';
import './App.css';
import { useEthtoWETH } from './EthtoWETH';

function App() {
  const [amount, setAmount] = useState('');

  const {
    convertETHToWETH, 
    withdrawWETH, 
    ethBalance, 
    wethBalance, 
    account, 
    connectWallet
  } = useEthtoWETH(); // Use the custom hook

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
          <p>WETH Balance: {wethBalance} WETH</p>
  
          <div className="input-container">
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
  
            <button onClick={() => convertETHToWETH(amount)}>
              Convert ETH to WETH
            </button>
  
            <button onClick={() => withdrawWETH(amount)}>
              Convert WETH to ETH
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
