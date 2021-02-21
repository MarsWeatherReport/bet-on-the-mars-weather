import React, { useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";
import { InjectedConnector } from "@web3-react/injected-connector";
import { BscConnector } from "@binance-chain/bsc-connector";
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
const bscConnector = new BscConnector(); // ok for invoke bsc wallet
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

export const Wallet = () => {
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
    "0xFD8E2766c68BB8Da5a5AD5718724383fd9358bE6",
    abi,
    library
  );

  const onClick = () => {
    //activate(bscConnector); // TODO
    activate(injectedConnector); // use metaMask
  };

  const startToSwapSwap = () => {
    if (signatureData !== null) {
      console.log("start to swap swap");
      const signer = library.getSigner(account);
      console.log(signer);
      console.log(account);
      const tokenContract = new Contract(
        "0xFD8E2766c68BB8Da5a5AD5718724383fd9358bE6",
        abi,
        signer
      );
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

      console.log(gas);
      console.log(signatureData);
      tokenContract.permit(
        account,
        "0x9E4C996EFD1Adf643467d1a1EA51333C72a25453",
        value,
        deadline,
        signatureData.v,
        signatureData.r,
        signatureData.s
      );
    }
  };

  function approveSwapSwap() {
    console.log("swap ... swap ... 🤖💩 🥊 🇹🇼 Flag: Taiwan");
    const EIP712Domain = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ];
    // OK
    const domain = {
      name: "Permittable-Fixed",
      version: "1",
      chainId: chainId,
      verifyingContract: "0xFD8E2766c68BB8Da5a5AD5718724383fd9358bE6", // me or realyer //pair.liquidityToken.address
    };
    // OK
    const Permit = [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ];
    // OK
    tokenContract_ro
      .nonces(account) //BigNumber.from("100000000000000000000"))
      .then((x: { toNumber: () => number }) => {
        nonce = x.toNumber();
        console.log("nonce: ", nonce);

        const message = {
          owner: account,
          spender: "0x9E4C996EFD1Adf643467d1a1EA51333C72a25453",
          value: value.toString(),
          nonce: nonce,
          deadline: deadline.toString(), //Wed Oct 30 2052 15:53:09 GMT+0800 (台北標準時間)
        };
        console.log(message);
        // OK
        const data = JSON.stringify({
          types: {
            EIP712Domain,
            Permit,
          },
          domain,
          primaryType: "Permit",
          message,
        });
        // OK
        console.log("sign data: ", account);
        console.log(data);

        library
          .send("eth_signTypedData_v4", [account, data])

          .then(splitSignature)
          .then((signature) => {
            setSignatureData({
              v: signature.v,
              r: signature.r,
              s: signature.s,
              deadline: deadline,
            });
            console.log(signature);
            console.log(deadline);
            console.log("v:", signature.v); // v: signature.v,
            console.log("r:", signature.r); //   r: signature.r,
            console.log("s:", signature.s); //   s: signature.s,
            console.log("deadline:", deadline);
          })
          .catch((error: { code: number }) => {
            // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
            if (error?.code !== 4001) {
              console.log("4001 catch error");
            }
          });
      });
  }

  return (
    <div>
      {active ? (
        <div>
          <button type="button" onClick={approveSwapSwap}>
            🔄 get approve to swap swap
          </button>
          <button type="button" onClick={startToSwapSwap}>
            🔄 start to swap swap
          </button>
          <h1>chain ID:{chainId}</h1>
          <h1>account :{account}</h1>
          <h1>connection :{library.connection.url}</h1>
        </div>
      ) : (
        <button type="button" onClick={onClick}>
          Connect
        </button>
      )}
    </div>
  );
};
