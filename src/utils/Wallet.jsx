import {
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
} from "@stacks/connect";
import { StacksMocknet, StacksTestnet } from "@stacks/network";
import {
  callReadOnlyFunction,
  ClarityType,
  standardPrincipalCV,
  standardPrincipalCVFromAddress,
  stringUtf8CV,
  uintCV,
} from "@stacks/transactions";
import { setGlobalState, getGlobalState, setAlert } from "../store";
import { ClarityValue, deserializeCV } from "@stacks/transactions";
// import { clarity } from "./clarity";
import { CONTRACT_NAME, CONTRACT_ADDRESS } from "./config/constants";
import { useConnect } from "@stacks/connect-react";
import { principalToString } from "@stacks/transactions/dist/clarity/types/principalCV";

const appConfig = new AppConfig(["store_write"]);
const userSession = new UserSession({ appConfig });
const appDetails = {
  name: "Hello Stacks",
  icon: "https://freesvg.org/img/1541103084.png",
};

const network = new StacksMocknet();

let contractAddress = CONTRACT_ADDRESS;
let contractName = CONTRACT_NAME;

const connectWallet = () => {
  showConnect({
    appDetails,
    onFinish: () => {
      if (userSession.isSignInPending()) {
        userSession.handlePendingSignIn().then((userData) => {
          setGlobalState("connectedAccount", userData.identityAddress);
        });
      } else if (userSession.isUserSignedIn()) {
        setGlobalState(
          "connectedAccount",
          userSession.loadUserData().profile.stxAddress.testnet
        );
      }

      setTimeout(() => getItemsForSale(), 1000);
      // const { doContractCall } = useConnect();
      //   window.location.reload();
    },
    userSession,
  });
};

const listNewItem = async (title, description, price, metadataURI) => {
  // const { doContractCall } = useConnect();

  const account = getGlobalState("connectedAccount");
  const timestamp = Date.now();

  console.log({ title, description, price, metadataURI });

  const response = await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "add-item",
    functionArgs: [
      stringUtf8CV(title),
      stringUtf8CV(description),
      uintCV(price),
      uintCV(timestamp),
      stringUtf8CV(metadataURI),
    ],
    sender: account,
    network: new StacksTestnet(),
    appDetails,
    onFinish: (data) => {
      console.log("onFinish:", data);
    },
    onCancel: () => {
      console.log("onCancel:", "Transaction was canceled");
    },
  });
  console.log(response);
};

const getItemsForSale = async () => {
  const items = [];
  const account = getGlobalState("connectedAccount");
  const response = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-nonce",
    functionArgs: [],
    senderAddress: account,
    network: new StacksTestnet(),
  });

  if (response.value) {
    const count = parseInt(response.value);
    console.log(count);
    for (let i = 1; i <= count; i++) {
      try {
        const responseItem = await callReadOnlyFunction({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "get-item",
          functionArgs: [uintCV(i)],
          senderAddress: account,
          network: new StacksTestnet(),
        });

        if (responseItem.value.data) {
          const data = responseItem.value.data;

          console.log(data);

          const item = {
            id: i,
            owner: principalToString(data.owner),
            cost: parseInt(data.price.value),
            title: data.name.data,
            description: data.description.data,
            metadataURI: data.url.data,
            timestamp: data.timestamp.value,
          };

          items.push(item);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  console.log(items);
  setGlobalState("nfts", items);
};

const buyItem = async (sellerAddress, id, quantity) => {
  const buyer = getGlobalState("connectedAccount");

  const response = await openContractCall({
    contractAddress,
    contractName,
    functionName: "buy-item",
    functionArgs: [
      clarity.decodePrincipal(sellerAddress),
      clarity.encodeInt(parseInt(id)),
      clarity.encodeInt(parseInt(quantity)),
    ],
    sender: buyer,
    postConditionMode: 0,
    network,
    appDetails,
  });
  console.log(response);
};

const cancelListing = async (id) => {
  const account = getGlobalState("connectedAccount");
  const response = await openContractCall({
    contractAddress,
    contractName,
    functionName: "cancel-listing",
    functionArgs: [clarity.encodeInt(parseInt(id))],
    sender: account,
    postConditionMode: 0,
    network,
    appDetails,
  });
  console.log(response);
};

const structuredNfts = (nfts) => {
  return nfts
    .map((nft) => ({
      id: Number(id),
      owner: nft.sellerAddress,
      cost: nft.price,
      title: nft.title,
      description: nft.description,
      metadataURI: nft.url,
      timestamp: nft.timestamp,
    }))
    .reverse();
};

const reportError = (error) => {
  setAlert(JSON.stringify(error), "red");
  throw new Error("No ethereum object.");
};

export { connectWallet, getItemsForSale, listNewItem, buyItem, cancelListing };
