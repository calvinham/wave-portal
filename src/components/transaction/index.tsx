import React, { FC } from 'react';
import { Wave } from '../../model/wave';
import styles from './index.module.scss';

interface Props {
  wave: Wave
}

export const Transaction: FC<Props> = (props: Props) => (
  <div className={styles.container}>
    <div className={styles.txnContainer}>
      <div className={styles.nonMessageData}>
        <div className={styles.walletContainer}>
          {props.wave.address}
        </div>
        <div className={styles.timestampContainer}>
          {props.wave.timestamp}
        </div>
      </div>
      <div className={styles.messageContainer}>
        {props.wave.message}
      </div>
    </div>
  </div>

);
