import React, { useState, useEffect } from 'react';
import { MainBody } from '../mainbody';
import styles from './index.module.scss';
import { ethers } from 'ethers';

const App = () => {
	const [currentAccount, setCurrentAccount] = useState<string>("")

	const checkWalletConnection = async () => {
		try {
			const { ethereum }: any = window;
			
			if (!ethereum) {
				setCurrentAccount("");
				return;
			};
	
			const accounts = await ethereum.request({method: 'eth_accounts' });
			console.log('getaccounts');
			if (accounts.length === 0) { 
				setCurrentAccount("");
				console.log("No authorized account found");
				return;
			} else if (accounts.length > 1) {
				setCurrentAccount("");
				console.log('more than one account found');
				return;
			}

			const account = accounts[0];
			setCurrentAccount(account);
			console.log("authorized account: ", account);

		} catch (error) {
			setCurrentAccount("");
			console.log(error);
		};
	};

	const connectWallet = async () => {
		try {
			const { ethereum }: any = window;
			if (!ethereum) {
				setCurrentAccount("");
				alert("Get Metamask!");
				return;
			}

			const accounts = await ethereum.request({ method: "eth_requestAccounts" });

			setCurrentAccount(accounts[0]);
			console.log("connected: ", accounts[0]);
		} catch (error) {
			setCurrentAccount("");
			console.log(error);
		}
	};

	useEffect(() => {
		checkWalletConnection();
	}, []);

	return(
		<div className={styles.container}>
			<MainBody account={currentAccount} connectWallet={connectWallet}/>
		</div>
	);
}

export default App;
