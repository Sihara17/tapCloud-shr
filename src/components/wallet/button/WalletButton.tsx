/* GUIDELINE https://docs.dappportal.io/mini-dapp/design-guide#connect-button */
import styles from "./WalletButton.module.css";
import { Logo } from "@/components/Assets/Logo";
import { useKaiaWalletSdk } from "@/components/wallet/Sdk/walletSdk.hooks";
import { useWalletAccountStore } from "@/components/wallet/account/auth.hooks";

export const WalletButton = () => {
  const { connectAndSign } = useKaiaWalletSdk();
  const { setAccount } = useWalletAccountStore();

  const handleClick = async () => {
    try {
      const [account]: [string] = await connectAndSign("connect");
      sessionStorage.setItem("ACCOUNT", account);
      setAccount(account);
    } catch (error) {
      console.error("Wallet connect error:", error);
    }
  };

  return (
    <button className={styles.root} onClick={handleClick}>
      <Logo className={styles.icon} />
      <p className={styles.description}>Connect</p>
    </button>
  );
};
