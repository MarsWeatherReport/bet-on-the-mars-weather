import React, { useState, Dispatch } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";
import { InjectedConnector } from "@web3-react/injected-connector";
import {
  Currency,
  currencyEquals,
  ETHER,
  Percent,
  WETH,
  Pair,
} from "@uniswap/sdk";
import { splitSignature } from "@ethersproject/bytes";
import { Contract } from "@ethersproject/contracts";
import { abi } from "./FIXabi";

let nonce = 0;
const value = 300000;
const deadline = 2613887589;
const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
    56, // Binance Smart Chain (testnet)
    77, // POA (mainnet)
    79, // Binance Smart Chain (mainnet)
    99, // POA sokol (testnet)
    100, // xDAI
  ],
});

  interface IData {
    current: string;
    previous: string;
  }
export const Wallet = () => {

  const [data, setData] = useState<IData>({current: '0', previous: '0'});

  const [signatureData, setSignatureData] = useState<{
    v: number;
    r: string;
    s: string;
    deadline: number;
  } | null>(null);

  const currentProvider = useWeb3React<Web3Provider>();
  const { library, account, activate, active, chainId } = currentProvider;
  console.log(currentProvider);
  if (currentProvider.library !== undefined) {
    console.log(currentProvider.library);
  }
  const tokenContract_ro = new Contract(
    "0x756387869AfDEeb868E82084CAa27847b0970B4B",
    abi,
    library
  );

  const onClick = async () => {
    activate(injectedConnector); // use metaMask
  };

  const betLowerPressure = () => {
    console.log('🐝 I bet lower pressure in next Sol')
    if (signatureData !== null) {
      const signer = library.getSigner(account);
      console.log(signer);
      console.log(account);
      const tokenContract = new Contract(
        "0xFD8E2766c68BB8Da5a5AD5718724383fd9358bE6",
        abi,
        signer
      );
      /*
      const args = [
        account,
        "0x9E4C996EFD1Adf643467d1a1EA51333C72a25453",
        value,
        deadline,
        signatureData.v,
        signatureData.r,
        signatureData.s,
      ];

      const gas = tokenContract.estimateGas.permit(...args);
      tokenContract.permit(
        account,
        "0x9E4C996EFD1Adf643467d1a1EA51333C72a25453",
        value,
        deadline,
        signatureData.v,
        signatureData.r,
        signatureData.s
      );
      */

      console.log(signatureData);
    }
  };

  async function betHigherPressure() {
    console.log('☠️ I bet higher pressure in next Sol')
    let currentPressure = await tokenContract_ro.showCurrentPressureOnMars();
    let oldPressure = await tokenContract_ro.old_pressure();
    setData({current : (currentPressure.toNumber()/10000).toString(), previous: (oldPressure.toNumber()/10000).toString()})
  }

  return (
    <div>
      {active ? (
        <div>
          <h1>Bet on The Weather on Mars</h1>
          <button type="button" onClick={betHigherPressure}>
            📡 I bet the Pressure on Mars will be higher than current pressure.
          </button>
          <p>----</p>
          <button type="button" onClick={betLowerPressure}>
            🛰 I bet the Pressure on Mars will be lower than current pressure.
          </button>
          <h1> network ⚡ :{chainId}</h1>
          <h1>Current Pressure: {data.current} (Pa)</h1>
          <h1>Previous Pressure: {data.previous} (Pa)</h1>
          <h1> 🙋‍♀️ :{account}</h1>
          <h1> 🐶 :{library.connection.url}</h1>
        </div>
      ) : (
        <button type="button" onClick={onClick}>
          Connect
        </button>
      )}
    </div>
  );
};
