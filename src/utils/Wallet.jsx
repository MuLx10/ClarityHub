import {
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
} from "@stacks/connect";
import { StacksMocknet } from "@stacks/network";
import { ClarityType, stringUtf8CV } from "@stacks/transactions";
import { setGlobalState, getGlobalState, setAlert } from "../store";
import { ClarityValue, deserializeCV } from '@stacks/transactions';
import { clarity } from "./clarity";
import { CONTRACT_NAME } from "./config/constants";

const appConfig = new AppConfig(["store_write"]);
const userSession = new UserSession({ appConfig });
const appDetails = {
  name: "Hello Stacks",
  icon: "https://freesvg.org/img/1541103084.png",
};

const network = new StacksMocknet();

let contractAddress = null;
let contractName = CONTRACT_NAME

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
          userSession.loadUserData().identityAddress
        );
      }
      // const { doContractCall } = useConnect();
      //   window.location.reload();
    },
    userSession,
  });
};

const buyNFT = async ({ id, cost }) => {
  try {
    const buyer = getGlobalState("connectedAccount");

    return true;
  } catch (error) {
    reportError(error);
  }
};


const listNewItem = async (
  title,
  description,
  price,
  metadataURI
) => {
  const account = getGlobalState("connectedAccount");
  const timestamp = Date.now();

  console.log({title, description, price, metadataURI})

  const response = await openContractCall({
    contractAddress,
    contractName,
    functionName: "list-item",
    functionArgs: [
      ClarityType.StringUTF8(title),
      clarity.encodeString(title),
      clarity.encodeString(description),
      clarity.encodeBigUInt(parseInt(price)),
      clarity.encodeBigUInt(timestamp),
      clarity.encodeString(metadataURI),
    ],
    sender: account,
    postConditionMode: 0,
    network,
    appDetails,
  });
  console.log(response);

  const result = deserializeCV(result).value;
  
  console.log(result);
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

const getItemsForSale = async () => {
  const items = [];
  const state = await clarity.getState(contractAddress);
  for (const [sellerAddress, itemIDs] of Object.entries(state.marketState)) {
    for (const [itemID, itemData] of Object.entries(itemIDs)) {
      const title = clarity.decodeBigUInt(itemData[0]).toString();
      const description = clarity.decodeInt(itemData[1]).toString();
      const cost = clarity.decodeInt(itemData[2]).toString();
      const stock = clarity.decodeInt(itemData[3]).toString();
      const metadataURI = clarity.decodeInt(itemData[3]).toString();
      const timestamp = clarity.decodeInt(itemData[3]).toString();
      items.push({
        title,
        description,
        sellerAddress,
        itemID,
        cost,
        stock,
        metadataURI,
        timestamp,
      });
    }
  }

  setGlobalState("nfts", structuredNfts(nfts));
};

const structuredNfts = (nfts) => {
  return nfts
    .map((nft) => ({
      id: Number(nft.itemID),
      owner: nft.sellerAddress,
      cost: nft.cost,
      title: nft.title,
      description: nft.description,
      metadataURI: nft.metadataURI,
      timestamp: nft.timestamp,
    }))
    .reverse();
};

const reportError = (error) => {
  setAlert(JSON.stringify(error), "red");
  throw new Error("No ethereum object.");
};

const initContract = (contractName) => {
  clarity.contractAddress(contractName).then((address) => {
    contractAddress = address;
  });
};

export {
  initContract,
  connectWallet,
  buyNFT,
  getItemsForSale,
  listNewItem,
  buyItem,
  cancelListing,
};
