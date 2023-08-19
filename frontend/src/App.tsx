import { useState } from "react";
import styles from "./styles/App.module.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  return (
    <main id={styles.root}>
      <nav>
        <p>Logo</p>
        <button>Sign in</button>
      </nav>
      <section className={styles.text}>
        <h1>Sepolia Faucet</h1>
        <p>Withdraw 0.05 Sepolia Eth every 24 hours</p>
        <p>Or Donate to the faucet as often as you like</p>
      </section>
      <section className={styles.buttons}>
        <button>Claim</button>
        <button>Donate</button>
      </section>
    </main>
  );
}

export default App;
