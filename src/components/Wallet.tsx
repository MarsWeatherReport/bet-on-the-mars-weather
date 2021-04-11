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
    balance: string;
    current: string;
    previous: string;
  }
export const Wallet = () => {

  const [data, setData] = useState<IData>({balance: '0', current: '0', previous: '0'});

  const currentProvider = useWeb3React<Web3Provider>();
  const { library, account, activate, active, chainId } = currentProvider;
  if (42 === chainId) {
    const networkId = 'Kavon'
  } else {
    const networkId = 'currently only support Kavon (testnet)' 
  }
  console.log(currentProvider);
  if (currentProvider.library !== undefined) {
    console.log(currentProvider.library);
  }

  // BetOnThePressureOnMars.sol (on Kovan testnet)
  const tokenContract_ro = new Contract(
    "0x756387869AfDEeb868E82084CAa27847b0970B4B",
    abi,
    library
  );

  var myVar: any = setInterval(( async () => { await dataInSync(); } ), 1000);
  const onClick = async () => {
    activate(injectedConnector); // use metaMask
  };

  const betLowerPressure = () => {
    console.log('🐝 requestMarsReport')
    const signer = library.getSigner(account);
    console.log(signer);
    console.log(account);
    const tokenContract = new Contract(
      "0x756387869AfDEeb868E82084CAa27847b0970B4B",
      abi,
      signer
    );
      tokenContract.requestMarsReport();
  };

  function myStopFunction() {
    clearInterval(myVar);
  }

  async function dataInSync() {
    console.log('☠️ xxx sync data to GUI')
    let currentPressure = await tokenContract_ro.showCurrentPressureOnMars();
    let oldPressure = await tokenContract_ro.old_pressure();
    const args = [ account ];
    let balance = await tokenContract_ro.showBalanceOf(...args);
    setData({balance: balance.toString(), current : (currentPressure.toNumber()/10000).toString(), previous: (oldPressure.toNumber()/10000).toString()})
    myStopFunction()
  }

  const getFreeBonus = () => {
    const signer = library.getSigner(account);
    const tokenContract = new Contract(
      "0x756387869AfDEeb868E82084CAa27847b0970B4B",
      abi,
      signer
    );
    console.log('🐝 free free free')
      tokenContract.getFreeBonus();
  };

  const settlement = () => {
    const signer = library.getSigner(account);
    const tokenContract = new Contract(
      "0x756387869AfDEeb868E82084CAa27847b0970B4B",
      abi,
      signer
    );
    console.log('🐝 win win win')
      tokenContract.settlement();
  };

  const higherP = () => {
    const signer = library.getSigner(account);
    const tokenContract = new Contract(
      "0x756387869AfDEeb868E82084CAa27847b0970B4B",
      abi,
      signer
    );
    console.log('🐝 higher higher higher')
      tokenContract.betOnLargerPressureNextSol(10);
  };
  const lowerP = () => {
    const signer = library.getSigner(account);
    const tokenContract = new Contract(
      "0x756387869AfDEeb868E82084CAa27847b0970B4B",
      abi,
      signer
    );
    console.log('🐝 lower lower lower')
      tokenContract.betOnSmallerPressureNextSol(10);
  };

  return (
    <div>
      {active ? (
        <div>
          <h1>Bet on The Weather on Mars</h1>
          <button type="button" onClick={betLowerPressure}>
            🛰 requestMarsReport -> from ChainLink 
          </button> only Owner (0x60968...)
          <button type="button" onClick={settlement}>
          🦄 settle 🦄 
          </button> 
<p>------- 🚀🔭🛰📡🌈 Muzamint Lab., Taiwan (Ming-der Wang) 👍🖐️👋🤝💪🙏🙌🔐 ---------</p>
          <button type="button" onClick={dataInSync}>
           🔄
          </button>
          <button type="button" onClick={getFreeBonus}>
          👉🏽 👉🏽 👉🏽 👉🏽 👉🏽 👉🏽  📡 get free bonus (100 points) just once.
          </button>
          <p/>
          <button type="button" onClick={higherP}>
          Bet 10 points on higher pressure on Mars on next Sol 👈
          </button> 
          <p/>
          <button type="button" onClick={lowerP}>
          👉🏽 Bet 10 points on lower pressure on Mars on next Sol.
          </button> 

          <h2> On network ⚡ :{networkId}</h2>
          <h2>Current Sol, Pressure on Mars: {data.current} (Pa)</h2>
          <h2>Previous Sol, Pressure on Mars: {data.previous} (Pa)</h2>
          <h2> 🙋‍♀️: {account}</h2>
          <h2> ‍💰: {data.balance}</h2>
          <h2> 🦊: {library.connection.url}</h2>
        </div>
      ) : (
        <button type="button" onClick={onClick}>
          🚀 Connect 🚀 X-Space 🚀 to Mars 
        </button>
      )}
    </div>
  );
};
