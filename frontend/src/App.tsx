import { useState, useEffect } from "react";
import { ethers } from "ethers";
import getContract from "./util/contract";
import styles from "./styles/App.module.css";
import logo from "./assets/faucet.png";

function App() {
  const [connected, setConnected] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);

  useEffect(() => {
    if (signer) {
      getContract(signer).then((contract) => {
        console.log("contract:", contract.interface.fragments);
        setContract(contract);
      });
      setSigner(signer);
    }
  }, [signer]);

  const connectWallet = async () => {
    let signer = null;
    let provider;
    if (window.ethereum === null) {
      provider = new ethers.JsonRpcProvider(import.meta.env.VITE_SEPOLIA_URL);
      setConnected(true);
      setProvider(provider);
    } else {
      // @ts-ignore
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      console.log("provider:", provider, "walletSigner:", signer.address);
      setConnected(true);
      setProvider(provider);
      setSigner(signer);
    }
  };

  const donate = async (amount: string) => {
    console.log("clicked");
    try {
      if (!connected) {
        alert("please connect wallet first");
      }
      if (!signer || !contract) {
        throw new Error("Signer or contract not available");
      }
      if (donationAmount === "") {
        alert("please enter a valid amount");
      }
      const donationInEther = ethers.parseEther(amount);
      // @ts-ignore
      const transaction = await signer.sendTransaction({
        to: contract.target,
        value: donationInEther,
      });

      const txReceipt = await transaction.wait();
      console.log(txReceipt);
      alert("Donation successful");
    } catch (error) {
      console.log(error);
      alert("Error occurred during donation");
    }
  };

  const claim = async () => {
    console.log("claim clicked");
    // const callData = contract.interface.encodeFunctionData("withdraw");
    // const nonce = await signer.getNonce();
    // const nonceHex = ethers.toBeHex(nonce);

    // const options = {
    //   method: "POST",
    //   headers: {
    //     accept: "application/json",
    //     "content-type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     id: 1,
    //     jsonrpc: "2.0",
    //     method: "alchemy_requestGasAndPaymasterAndData",
    //     params: [
    //       {
    //         policyId: import.meta.env.VITE_POLICY_ID,
    //         entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    //         dummySignature:
    //           "0xe8fe34b166b64d118dccf44c7198648127bf8a76a48a042862321af6058026d276ca6abb4ed4b60ea265d1e57e33840d7466de75e13f072bbd3b7e64387eebfe1b",
    //         userOperation: {
    //           sender: signer.address,
    //           nonce: nonceHex,
    //           initCode: "0x",
    //           callData: callData,
    //         },
    //       },
    //     ],
    //   }),
    // };
    // const response = await fetch(import.meta.env.VITE_SEPOLIA_URL, options)
    //   .then((response) => response.json())
    //   .then((response) => console.log(response))
    //   .catch((err) => console.error(err));
    console.log("claim clicked");
    try {
      const transaction = await contract.withdraw();
      const txReceipt = await transaction.wait();
      setReceipt(txReceipt);
      console.log(txReceipt);
    } catch (error: any) {
      const errorMessageMatch = error
        .toString()
        .match(/execution reverted: "(.*?)"/);
      const errorMessage = errorMessageMatch
        ? errorMessageMatch[1]
        : "An error occurred";

      alert("Error occurred during claim: " + errorMessage);
    }
  };

  return (
    <>
      <nav className={styles.nav}>
        <img src={logo} alt="logo" />
        <button onClick={connectWallet}>
          {connected ? "Connected" : "Connect"}
        </button>
      </nav>
      <main id={styles.root}>
        <section className={styles.text}>
          <h1>Sepolia Faucet</h1>
        </section>
        <section className={styles.buttons}>
          <p>Claim 0.05 Sepolia Eth every 24 hours</p>
          <button onClick={() => claim()}>Claim</button>
          <p>Or Donate to the faucet as often as you like</p>
          <input
            type="text"
            placeholder="Enter amount"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
          />
          <button onClick={() => donate(donationAmount)}>Donate</button>
        </section>
        {receipt && (
          <section>
            <p>Follow Your Transaction: {receipt.hash}</p>
          </section>
        )}
      </main>
    </>
  );
}

export default App;
