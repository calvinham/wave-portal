import React, { useState, useEffect } from 'react';
import { Wave } from '../../model/wave';
import { Transaction } from '../transaction';
import styles from './index.module.scss';
import { createWaveTxn, getWaves, getWaveCount, listenForNewWaves }  from '../../service';

const initialWaves: Wave[] = [];

interface Props {
	account: any;
	connectWallet: any;
}

export const MainBody = (props: Props) => {
	const [messageText, setMessageText] = useState<string>('');
	const [waves, setWaves] = useState<Wave[]>(initialWaves);
	const [totalWaves, setTotalWaves] = useState<number>(0);

	const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMessageText(e.target.value);
	};

	const accountIsConnected = (): Boolean => {
		if (props.account === "") {
			return false;
		}
		return true;
	}
	
	const handleClick = async () => {
		if (!accountIsConnected) { return }
		if (messageText === '') { return }
		await createWaveTxn(messageText);
		setMessageText('');
	};

	const handleGetAllWaves = async () => {
		if (!accountIsConnected) { return }
		const retrieved = await getWaves();
		if (retrieved !== undefined) {
			setWaves(retrieved);
		}
	};

	const handleGetWaveCount = async () => {
		if (!accountIsConnected) { return }
		const count = await getWaveCount();
		if (count !== undefined) {
			setTotalWaves(count);
		}
	};

	const handleListenToNewWaves = async () => {
		if (!accountIsConnected) { return }
		const retrieved = await listenForNewWaves(setWaves);
	}

	useEffect(() => {
		handleGetWaveCount();
		handleGetAllWaves();
	}, []);

	useEffect(() => {
		handleListenToNewWaves();
	}, []);

	const renderHeader = () => (
		<div className={styles.headerContainer}>
			<div className={styles.header}>Waveportal</div>
		</div>
	);

	const renderConnectWalletButton = () => (
		<div className={styles.buttonContainer}>
			<div className={styles.waveButton} onClick={props.connectWallet}>
				<div className={styles.buttonText}>connect wallet</div>
			</div>
		</div>
	);

	const renderTextFieldAndWaveButton = () => (
		<div>
			<div className={styles.textInputContainer}>
				<input
					className={styles.textInput}
					type="text"
					value={messageText}
					placeholder="leave a message!"
					onChange={handleTextChange}
				/>
			</div>
			
			<div className={styles.buttonContainer}>
				<div className={styles.waveButton} onClick={handleClick}>
					<div className={styles.buttonText}>wave</div>
				</div>
			</div>
		</div>
	);

	const renderBody = () => (
		<div className={styles.bodyContainer}>
			<div className={styles.textContainer}>
				Connect your wallet and leave a message!
			</div>
			{!props.account ? renderConnectWalletButton() : renderTextFieldAndWaveButton()}
		</div>
	);

	return (
		<div className={styles.container}>
			<div className={styles.dataContainer}>
				{renderHeader()}
				<div className={styles.countContainer}>
					<div>{`So far ${totalWaves} waves have been sent!`} </div>
				</div>
				{renderBody()}
				{waves.length !== 0 
						? <div className={styles.transactionsContainer}>
								{waves.map((wave: Wave) => 
									<Transaction key={wave.timestamp} wave={wave}/>
								)}
							</div>
						: null}
			</div>
		</div>
	);
};
