import React, { useState } from 'react';
import { cryptography, transactions } from '@liskhq/lisk-client';
import * as api from './api.js';

const Transfer = () => {
    const [state, updateState] = useState({
        address: '',
        amount: '',
        fee: '',
        passphrase: '',
        transaction: {},
        response: {},
        data: {}
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        updateState({
            ...state,
            [name]: value,
        });
    };

    const handleClick = async (e) => {
      e.preventDefault();
      const client = await api.getClient();

      //const data = client.invoke('monitor:getBlockStats')
      client.invoke('monitor:getTransactionStats').then((val) => {
        console.log("asynchronous logging has val:",val);
        updateState({
          ...state,
          data: val
        });
      });
    };

    const handleClick2 = async (e) => {
      e.preventDefault();
      console.log('data');
      console.log(state.data);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const client = await api.getClient();
        const address = cryptography.getAddressFromBase32Address(state.address);
        const tx = await client.transaction.create({
            moduleID: 2,
            assetID: 0,
            fee: BigInt(transactions.convertLSKToBeddows(state.fee)),
            asset: {
                amount: BigInt(transactions.convertLSKToBeddows(state.amount)),
                recipientAddress: address,
                data: '',
            },
        }, state.passphrase);
        let res;
        try {
            res = await client.transaction.send(tx);
        } catch (error) {
            res = error;
        }

        updateState({
            transaction: client.transaction.toJSON(tx),
            response: res,
            address: '',
            amount: '',
            fee: '',
            passphrase: '',
        });
    };

    return (
        <div>
            <h2>Transfer</h2>
            <p>Send tokens from one account to another.</p>
            <a href="#" onClick={handleClick}>
              Click me
            </a>
            <a href="#" onClick={handleClick2}>
              console log
            </a>
            <form onSubmit={handleSubmit}>
                <label>
                    Recipient:
                        <input type="text" id="address" name="address" onChange={handleChange} value={state.address} />
                </label>
                <label>
                    Amount (1 = 10^8 tokens):
                        <input type="text" id="amount" name="amount" onChange={handleChange} value={state.amount} />
                </label>
                <label>
                    Fee:
                        <input type="text" id="fee" name="fee" onChange={handleChange}  value={state.fee} />
                </label>
                <label>
                    Passphrase:
                        <input type="text" id="passphrase" name="passphrase" onChange={handleChange}  value={state.passphrase} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            {state.transaction &&
                <div>
                    <pre>Transaction: {JSON.stringify(state.transaction, null, 2)}</pre>
                    <pre>Response: {JSON.stringify(state.response, null, 2)}</pre>
                </div>
            }
            {state.data &&
                <div>
                    <pre>data: {JSON.stringify(state.data, null, 2)}</pre>
                </div>
            }
        </div>
    );
}
export default Transfer;
