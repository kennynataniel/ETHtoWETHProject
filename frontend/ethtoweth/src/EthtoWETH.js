// AuctionContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { AuctionABI } from './abi';
import { connectMetamask } from './connectMetamask';

const AuctionContext = createContext();

export const AuctionProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [auctionContract, setAuctionContract] = useState(null);
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [ended, setEnded] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');

  const contractAddress = '0x7a8c8ab75cc2855b3ea72b44fd502da0c602b598';

  useEffect(() => {
    const init = async () => {
      try {
        const { address, balance } = await connectMetamask();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const auctionContract = new ethers.Contract(contractAddress, AuctionABI, signer);

        setProvider(provider);
        setSigner(signer);
        setAccount(address);
        setBalance(ethers.utils.formatEther(balance));
        setAuctionContract(auctionContract);

        const highestBid = await auctionContract.highestBid();
        const highestBidder = await auctionContract.highestBidder();
        const owner = await auctionContract.owner();
        const ended = await auctionContract.ended();

        setHighestBid(ethers.utils.formatEther(highestBid));
        setHighestBidder(highestBidder);
        setEnded(ended);
        setIsOwner(address === owner);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    init();
  }, [contractAddress]);

  const placeBid = async (bidAmount) => {
    if (auctionContract) {
      const tx = await auctionContract.bid({ value: ethers.utils.parseEther(bidAmount) });
      await tx.wait();
    }
  };

  return (
    <AuctionContext.Provider value={{ placeBid, highestBid, highestBidder, isOwner, ended, account, balance }}>
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => useContext(AuctionContext);
