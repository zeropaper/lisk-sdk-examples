const ipfsClient = require('ipfs-http-client');
const util = require('util');
//const ipfs = ipfsClient('ipfs.infura.io', '5001', { protocol: 'https' });
const ipfs = ipfsClient('127.0.0.1', '5001', { protocol: 'http' });
const hash = "QmcSsFettYxTi4i23cLatfH41swoKgpu5RgYVB74bX9mgu";
//const packageJsonHash = "QmcSsFettYxTi4i23cLatfH41swoKgpu5RgYVB74bX9mgu" + "/package.json";
const packageJsonHash = "QmNnVQ43sXwufDS2b8uTh8Jb4KVxBgwGvth54ErDJ6MxzW" + "/package.json";

const ipfsGet = util.promisify(ipfs.get);
const errors = [];

async function callIpfsGet() {
    const files = await ipfsGet(packageJsonHash);
    if (!files || files.length < 1 ) {
        errors.push("No files found under provided hash.");
        return errors;
    }
    const file = files[0];
    console.log(file.path);
    if (file.content) {
        const packageJson = JSON.parse(file.content.toString('utf8'));
        console.log("name");
        console.log(packageJson.name);
        console.log(packageJson.version);
        if (!packageJson.publicKey) {
            errors.push("No publicKey found in package.json file.");
            return errors;
        }
        if (packageJson.publicKey !== this.senderPublicKey) {
            errors.push("Publickey in package.json does not match the senders publicKey.");
            return errors;
        }
        //update the account in the database with the new package version.
       // store.account.set(sender.address, sender);
    };
    return errors;
}

console.log(callIpfsGet());
