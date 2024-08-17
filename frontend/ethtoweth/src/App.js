import React, { useState, useEffect } from 'react';
import './App.css';
import { useEthtoWETH } from './EthtoWETH';
import fetchTransactionDetails from './HistoryTransaction'; // Import the transaction fetcher

function App() {
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]); // State to store transactions

  const {
    convertETHToWETH, 
    withdrawWETH, 
    ethBalance, 
    wethBalance, 
    account, 
    connectWallet,
    error, 
  } = useEthtoWETH(); 

  // Fetch transactions when the component mounts
  useEffect(() => {
    const getTransactions = async () => {
      try {
        const txDetails = await fetchTransactionDetails();
        setTransactions(txDetails); // Set the transactions in state
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    if (account) {
      getTransactions();
    }
  }, [account]);

  return (
    <div className="app-container">
      <h1>ETH to WETH Converter</h1>

      {!account && (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}

      {account && (
        <div className="content-container">
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

          <div className="input-container">
            {error && <p className="error-message">{error}</p>} 
          </div>

          {/* Display the transactions */}
          <div className="transaction-history">
            <h2>Transaction History</h2>
            <div className="transaction-grid">
              {transactions.length > 0 ? (
                transactions.map((tx, index) => (
                  <div key={index} className="transaction-item">
                    <p><strong>Method:</strong> {tx.method}</p>
                    <p><strong>From:</strong> {tx.fromAddress}</p>
                    <p><strong>Value:</strong> {tx.value} WEI</p>
                    <p><strong>Date:</strong> {tx.timestamp}</p>
                  </div>
                ))
              ) : (
                <p>No transactions found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
