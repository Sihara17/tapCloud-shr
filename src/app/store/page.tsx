"use client";

import {ItemCard} from "@/components/item/ItemCard";
import styles from "./page.module.css";
import {usePaymentSdk} from "@/components/store/sdk/paymentSdk.hooks";
import {useCallback} from "react";

export default function Store () {
    const { openPaymentHistory } = usePaymentSdk();

    const onPaymentHistoryButtonClick = useCallback(() => {
        openPaymentHistory();
    },[openPaymentHistory]);
    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <button onClick={onPaymentHistoryButtonClick} className={styles.button}>payment history</button>
            </div>
            <div className={styles.body}>
                <ItemCard itemIdentifier="item_1" name="item_1" imageUrl='/images/logo.png' price={1} currencyCode="USD" />
                <ItemCard itemIdentifier="item_2" name="item_2" imageUrl='/images/logo.png' price={2} currencyCode="USD" />
            </div >
        </div>
    );
}
