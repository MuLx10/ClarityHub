import React, { useState, useEffect } from "react";
import { ClarityType } from "@stacks/connect";
import { useConnect } from "@stacks/connect-react";
import { clarity } from "./clarity";

const contractName = "simple-marketplace";

function App() {
  const { doContractCall } = useConnect();
  const [itemID, setItemID] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemStock, setItemStock] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");
  const [itemsForSale, setItemsForSale] = useState([]);

  const listNewItem = async () => {
    const response = await doContractCall({
      contractAddress: await clarity.contractAddress(contractName),
      contractName,
      functionName: "list-item",
      functionArgs: [
        clarity.encodeInt(parseInt(itemID)),
        clarity.encodeBigUInt(parseInt(itemPrice)),
        clarity.encodeInt(parseInt(itemStock)),
      ],
      sender: sellerAddress,
      postConditionMode: 0,
      network: "testnet",
    });
    console.log(response);
  };

  const buyItem = async (sellerAddress, itemID, quantity) => {
    const response = await doContractCall({
      contractAddress: await clarity.contractAddress(contractName),
      contractName,
      functionName: "buy-item",
      functionArgs: [
        clarity.decodePrincipal(sellerAddress),
        clarity.encodeInt(parseInt(itemID)),
        clarity.encodeInt(parseInt(quantity)),
      ],
      postConditionMode: 0,
      network: "testnet",
    });
    console.log(response);
  };

  const cancelListing = async (itemID) => {
    const response = await doContractCall({
      contractAddress: await clarity.contractAddress(contractName),
      contractName,
      functionName: "cancel-listing",
      functionArgs: [clarity.encodeInt(parseInt(itemID))],
      sender: sellerAddress,
      postConditionMode: 0,
      network: "testnet",
    });
    console.log(response);
  };

  useEffect(() => {
    const getItemsForSale = async () => {
      const items = [];
      const contractAddress = await clarity.contractAddress(contractName);
      const state = await clarity.getState(contractAddress);
      for (const [sellerAddress, itemIDs] of Object.entries(state.marketState)) {
        for (const [itemID, itemData] of Object.entries(itemIDs)) {
          const price = clarity.decodeBigUInt(itemData[0]).toString();
          const stock = clarity.decodeInt(itemData[1]).toString();
          items.push({ sellerAddress, itemID, price, stock });
        }
      }
      setItemsForSale(items);
    };
    getItemsForSale();
  }, []);

  return (
    <div>
      <h1>Simple Marketplace</h1>
      <h2>List an item for sale</h2>
      <label>Item ID: </label>
      <input type="text" value={itemID} onChange={(e) => setItemID(e.target.value)} />
      <br />
      <label>Price: </label>
      <input type="text" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
      <br />
      <label>Stock: </label>
      <input type="text" value={itemStock} onChange={(e) => setItemStock(e.target.value)} />
      <br />
      <label>Seller Address: </label>
      <input type="text" value={sellerAddress} onChange={(e
