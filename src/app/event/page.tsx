"use client";

import {useWalletAccountStore} from "@/components/wallet/account/auth.hooks";
import {useKaiaWalletSdk} from "@/components/wallet/sdk/walletSdk.hooks";
import {useCallback} from "react";
import styles from "./page.module.css";

export default function Event() {
    const { account, setAccount } = useWalletAccountStore();
    const { disconnectWallet } = useKaiaWalletSdk();

    const onDisconnectButtonClick = useCallback(() => {
        disconnectWallet().then(() => {
            setAccount(null);
            sessionStorage.removeItem('ACCOUNT');
        });
    }, [disconnectWallet, setAccount]);

    return (
        <div className={styles.root}>
            <div className={styles.body}>
                {account ? (
                    <>
                        <p>wallet address: {account.slice(0, 5) + '...' + account.slice(-3)}</p>
                        <button className={styles.button} onClick={onDisconnectButtonClick}>
                            disconnect
                        </button>
                    </>
                ) : (
                    <>need login</>
                )}
            </div>
        </div>
    );
}
