
import React from 'react';
import { ethers } from 'ethers';
import { CONTACT_ADDRESS } from '../util/constants';
import contractABI from '../util/WavePortal.json';
import { Wave } from '../model/wave';

declare let window: any;

export const createWaveTxn = async (messageText: string) => {
  try {
    const { ethereum }: any = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTACT_ADDRESS, contractABI.abi, signer);

    if (contract !== undefined) {
      const waveTxn = await contract.wave(messageText, { gasLimit: 300000 });
      console.log('Mining... ', waveTxn.hash);

      await waveTxn.wait();
      console.log('Mined--', waveTxn.hash);
    } else {
      console.log('contract was undefined');
    }
  } catch (error) {
    console.log(error);
  }
};

export const getWaveCount = async (): Promise<number | undefined> => {
  try {
    const { ethereum }: any = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTACT_ADDRESS, contractABI.abi, signer);

    const count = await contract.getTotalWaves();
    console.log('returned total waves count: ', count);

    const x = Number(count);
    console.log(x);
    return count;

  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const getWaves = async () => {
  const { ethereum } = window;
  try {
    if (window.ethereum) { 
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTACT_ADDRESS, contractABI.abi, signer);
  
      const waves = await contract.getAllWaves();
      let wavesCleaned: Wave[] = [];

      waves.forEach((wave: any) => {
        const timestamp = new Date(wave.timestamp * 1000).toString()
        const formattedTimeStamp = timestamp.split(' (')[0];

        wavesCleaned.push({
          address: wave.waver,
          timestamp: formattedTimeStamp,
          message: wave.message
        });
      });

      console.log(wavesCleaned);
      return wavesCleaned;
    } else {
      console.log('Ethereum object does not exist!');
      return undefined;
    }
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const listenForNewWaves = async (setWaves: React.Dispatch<React.SetStateAction<Wave[]>>) => {
  console.log('listening for new waves!');
  const { ethereum } = window;
  try {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTACT_ADDRESS, contractABI.abi, signer);

      contract.on('NewWave', async (from, timestamp, message) => {
        console.log('NewWave', from, timestamp, message);

        const waves = await contract.getAllWaves();
        setWaves(waves);
      });
    } else {
      console.log('Ethereum object does not exist!'); 
    }
  } catch (error) {
    console.log(error);
  }
};
