import { useState } from "react";
import { ethers } from "ethers";
import getContract from "./util/contract";
import styles from "./styles/App.module.css";
import logo from "./assets/faucet.png";

function App() {
  const [provider, setProvider] = useState(null);
  const [singer, setSigner] = useState(null);
  const [connected, setConnected] = useState(false);

  const connectWallet = async () => {
    let signerSet = null;
    let providerSet;
    if (window.ethereum === null) {
      providerSet = new ethers.JsonRpcProvider(
        import.meta.env.VITE_SEPOLIA_URL
      );
      // @ts-ignore
      setProvider(providerSet);
      setConnected(true);
    } else {
      // @ts-ignore
      providerSet = new ethers.BrowserProvider(window.ethereum);
      // @ts-ignore
      signerSet = await providerSet.getSigner();
      // @ts-ignore
      setSigner(signerSet);
      setConnected(true);
    }
  };

  return (
    <main id={styles.root}>
      <nav className={styles.nav}>
        <img src={logo} alt="logo" />
        <button onClick={connectWallet}>Connect</button>
      </nav>
      <section className={styles.text}>
        <h1>Sepolia Faucet</h1>
      </section>
      <section className={styles.buttons}>
        <p>Claim 0.05 Sepolia Eth every 24 hours</p>
        <button>Claim</button>
        <p>Or Donate to the faucet as often as you like</p>
        <input type="text" placeholder="Enter amount" />
        <button>Donate</button>
      </section>
    </main>
  );
}

export default App;
