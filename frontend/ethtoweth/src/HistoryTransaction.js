// HistoryTransaction.js

import axios from 'axios';

const API_KEY = process.env.ETHERSCAN_API_KEY; // Replace with your Etherscan API key
const address = '0xE39C855Ef6C10c92DAbB5a21c8B2c5FFdC6dD22d'; // Replace with the desired Ethereum address

const fetchTransactionDetails = async () => {
    try {
        const response = await axios.get('https://api-sepolia.etherscan.io/api', {
            params: {
                module: 'account',
                action: 'txlist',
                address: address,
                startblock: 0,
                endblock: 99999999,
                sort: 'asc',
                apikey: API_KEY
            }
        });
        console.log(response.data)
        const transactions = response.data.result.map(tx => ({
            value: Number(tx.value), // Convert from wei to ETH
            fromAddress: tx.from,
            timestamp: new Date(tx.timeStamp * 1000).toLocaleString(),
            method: tx.functionName // Convert Unix timestamp to human-readable date
        }));

        return transactions;
    } catch (error) {
        console.error('Error fetching transaction details:', error);
        throw new Error('Error fetching transaction details.');
    }
};

export default fetchTransactionDetails;
