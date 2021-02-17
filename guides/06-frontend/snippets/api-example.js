const { createIPCClient, createWSClient } = require('@liskhq/lisk-api-client');
let clientCache;

const getClient = async () => {
  if (!clientCache) {
    clientCache = await createWSClient('ws://localhost:8080/ws');
  }
  return clientCache;
};

const useClient = async () => {
  const client = await getClient();
  const blockAtHeight123 = await client.block.getByHeight(123);
  client.subscribe('app:block:new', ( data ) => {
    console.log("new block:",data);
  });
  return blockAtHeight123;
};

useClient().then((val) => {
  console.log("val:",val);
});
