//import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../utils";
import { fetchAccountInfo } from "../api";
import * as transactions from '@liskhq/lisk-transactions';
import * as codec from '@liskhq/lisk-codec';
import * as cryptography from '@liskhq/lisk-cryptography';

export const transferAssetSchema = {
  $id: "lisk/transfer-asset",
  title: "Transfer transaction asset",
  type: "object",
  required: ["amount", "recipientAddress", "data"],
  properties: {
    amount: {
      dataType: "uint64",
      fieldNumber: 1,
    },
    recipientAddress: {
      dataType: "bytes",
      fieldNumber: 2,
      minLength: 20,
      maxLength: 20,
    },
    data: {
      dataType: "string",
      fieldNumber: 3,
      minLength: 0,
      maxLength: 64,
    },
  },
};

export const transfer = async ({
  recipientAddress,
  amount,
  passphrase,
  fee,
  networkIdentifier,
  minFeePerByte,
}) => {
  const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
    passphrase
  );
  const address = cryptography.getAddressFromPassphrase(passphrase);
  const {
    sequence: { nonce },
  } = await fetchAccountInfo(address.toString("hex"));

  const tx = transactions.signTransaction(
    transferAssetSchema,
    {
      moduleID: 2,
      assetID: 0,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        amount: BigInt(transactions.convertLSKToBeddows(amount)),
        recipientAddress: Buffer.from(recipientAddress, 'hex'),
        data: "",
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );
  const { id, ...rest } = tx;

  const schema = getFullAssetSchema(transferAssetSchema);
  console.log('schema');
  console.log(schema);
  console.log('rest');
  console.log(rest);
  const json = codec.codec.toJSON(schema, rest);
  const bin = codec.codec.encode(schema,rest);

  return {
    id: id.toString("hex"),
    tx: json,
    minFee: calcMinTxFee(transferAssetSchema, minFeePerByte, rest),
    binaryHex: bin
  };
};
