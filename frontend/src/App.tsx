import { useState, useEffect } from "react";
import { ethers } from "ethers";
import getContract from "./util/contract";
import styles from "./styles/App.module.css";
import logo from "./assets/faucet.png";

function App() {
  const [connected, setConnected] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [reciept, setReciept] = useState<any>(null);

  useEffect(() => {
    if (signer) {
      getContract(signer).then((contract) => {
        console.log("contract:", contract);
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
    } else {
      // @ts-ignore
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      console.log("provider:", provider, "walletSigner:", signer);
      setSigner(signer);
      setConnected(true);
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
        to: "0x4eF2d17D95171331EB6c67c5b154d0dae4147C6E",
        value: donationInEther,
      });
      // Wait for the transaction to be mined
      const txReceipt = await transaction.wait();
      console.log(txReceipt);
      setReciept(txReceipt);
      alert("Donation successful");
    } catch (error) {
      console.log(error);
      alert("Error occurred during donation");
    }
  };

  const claim = async () => {
    const transaction = await contract.withdraw();
    const txReceipt = await transaction.wait();
    console.log(txReceipt);
  };

  return (
    <main id={styles.root}>
      <nav className={styles.nav}>
        <img src={logo} alt="logo" />
        <button onClick={connectWallet}>
          {connected ? "Connected" : "Connect"}
        </button>
      </nav>
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
      {reciept && (
        <section>
          <p>Follow Your Transaction: {reciept.hash}</p>
        </section>
      )}
    </main>
  );
}

export default App;
