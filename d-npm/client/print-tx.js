const RegisterPackageTransaction = require("../register-package-transaction");
const transactions = require("@liskhq/lisk-transactions");
const { EPOCH_TIME } = require("@liskhq/lisk-constants");

/**
 *  To directly send the printed transaction:
 *  > node print_sendable_hello-world.js | curl -X POST -H "Content-Type: application/json" -d @- localhost:4000/api/transactions
 *  Note: An node needs to run on port 4000 (the default one) before. If the node runs on a different port, adjust the query accordingly.
 */

const getTimestamp = () => {
  // check config file or curl localhost:4000/api/node/constants to verify your epoc time
  const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
  const inSeconds = (millisSinceEpoc / 1000).toFixed(0);
  return parseInt(inSeconds);
};

const tx = new RegisterPackageTransaction({
  asset: {
    name: "my-package",
    version: "0.2.3",
    hash: "QmNnVQ43sXwufDS2b8uTh8Jb4KVxBgwGvth54ErDJ6MxzW",
    //hash: "QmNxfyMgkTgpvB9WjteQZUfmD66v2oeCCAhqrDo3vg3NUA",
    //hash: "QmPipKX8tNkr1d2CYDEY7HMr5VipP9dfRtQQUGDNcEAaXU",
    //hash: "QmQfF73qscbFh441WoYVpaQKTFekU5VNmTUWYydn6buNVq",
    //hash: "QmaRn1KPrM3SPfZsUu6g47iTviN2Xxte6rAc5PbdxTZUGp",
    //hash: "Qmf9rESV2vCHsy534Upe1d1BoApXmNsCc3ya2yt7Eb755N",
    //hash: "QmeHqo8itt8xemv6LB9GrQ4iLtpJyCq87nCwyyU9DWDGmn",
    //hash: "QmcSsFettYxTi4i23cLatfH41swoKgpu5RgYVB74bX9mgu",
   // hash:"QmS16eQAXTR5pLXZr3XsT3YiEk7tEjzNAfwLJhLEM5evnp"
   // hash: "QmVjpMZtRMdZSXPgmQezq8oUt5UqHNjzwVTWpvxhXiGbtS"
    //hash: "QmXX4G6DMufNNk8YsXL5jGSyHFjc6y9gkf4dpF5uSAKQ1p"
      //Qmd9UfYXskDJtXkS6UptmKf2tbJnNgKDuELH9jeR6JbF8J
      //QmNnVQ43sXwufDS2b8uTh8Jb4KVxBgwGvth54ErDJ6MxzW
  },
  //fee: `${transactions.utils.convertLSKToBeddows('1')}`,
  // recipientId: '10881167371402274308L', //delegate genesis_100
  //timestamp: getTimestamp(),
  fee: `${transactions.utils.convertLSKToBeddows("0")}`,
  recipientId: "16313739661670634666L", //senderId
  timestamp: getTimestamp()
});

tx.sign(
//  "wagon stock borrow episode laundry kitten salute link globe zero feed marble"
   "actress route auction pudding shiver crater forum liquid blouse imitate seven front"
);

console.log(tx.stringify());
process.exit(1);
