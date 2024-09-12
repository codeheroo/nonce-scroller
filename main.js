const { ethers } = require("ethers");
const config = require("./config.json");

const provider = new ethers.JsonRpcProvider(config.provider);

const wallet = new ethers.Wallet(config.privatekey, provider);

const receiver = wallet.address;

async function sendSelfZeroTransactions() {
  try {
    const sender = await wallet.getAddress();
    console.log(`Sending transactions from: ${sender}`);

    let nonce = await provider.getTransactionCount(sender);
    console.log(`Starting nonce: ${nonce}`);

    for (let i = 0; i < config.count; i++) {
      const tx = {
        to: receiver,
        value: ethers.parseEther("0"),
        nonce: nonce + i,
        gasLimit: 21000,
        gasPrice: ethers.parseUnits(config.gasPriceGwei, "gwei"),
      };

      const signedTx = await wallet.sendTransaction(tx);
      console.log(`Transaction ${i + 1} sent: ${signedTx.hash}`);
    }

    console.log(config.count, "transactions have been sent.");
  } catch (error) {
    console.error("Error sending transactions:", error);
  }
}

sendSelfZeroTransactions();
