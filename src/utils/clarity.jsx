import {
  cvToValue,
  deserializeCV,
  ClarityType,
  createAddress,
} from "@stacks/transactions";

import { StacksTestnet } from "@stacks/network";


const network = new StacksTestnet();

export const clarity = {
  contractAddress: async (contractName) => {
    const address = await makeReadOnlyCallAsync({
      contractAddress: createAddress(contractName, "st00000000000000000000001"),
      contractName: "contracts",
      functionName: "get-address",
      functionArgs: [ClarityType.String(contractName)],
      network,
    });
    return address;
  },

  decodeBigUInt: (value) => cvToValue(deserializeCV(Buffer.from(value, "hex"))),

  decodeInt: (value) => cvToValue(deserializeCV(Buffer.from(value, "hex"))),

  decodePrincipal: (value) =>
    cvToValue(deserializeCV(Buffer.from(value.slice(2), "hex"))),

  encodeBigUInt: (value) =>
    deserializeCV(Buffer.from(value.toString(16), "hex")).toString("hex"),

  encodeInt: (value) =>
    deserializeCV(Buffer.from(value.toString(16), "hex")).toString("hex"),

  encodeString: (value) =>
    deserializeCV(Buffer.from(value, "utf8")).toString("hex"),

  makeContractCallAsync: async ({
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    sender,
    postConditionMode,
  }) => {
    const transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      sender,
      network,
      postConditionMode,
    });
    return broadcastTransaction(transaction, network);
  },

  makeReadOnlyCallAsync: async ({
    contractAddress,
    contractName,
    functionName,
    functionArgs,
  }) => {
    return makeReadOnlyCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      network,
    });
  },

  getState: async (contractAddress) => {
    return makeReadOnlyCallAsync({
      contractAddress,
      contractName: "st-bucket",
      functionName: "read",
      functionArgs: [ClarityType.Tuple([ClarityType.String("state")])],
      network,
    });
  },
};
