const ipfsClient = require('ipfs-http-client');
const util = require('util');
const ipfs = ipfsClient('ipfs.infura.io', '5001', { protocol: 'https' });
const hash = "QmcSsFettYxTi4i23cLatfH41swoKgpu5RgYVB74bX9mgu";
const packageJsonHash = "QmcSsFettYxTi4i23cLatfH41swoKgpu5RgYVB74bX9mgu" + "/package.json";

const ipfsGet = util.promisify(ipfs.get);
const errors = [];

async function callIpfsGet() {
    const files = await ipfsGet(packageJsonHash);
    for(var i = 0; i < files.length; i++) {
        //files.forEach((file) => {
        console.log(files[i].path);
        if (files[i].content) {
            const packageJson = JSON.parse(files[i].content.toString('utf8'));
            console.log("name");
            console.log(packageJson.name);
            console.log(packageJson.version);
            if (!packageJson.publicKey) {
                errors.push("No publicKey found in package.json file.");
                break;
            }
            if (packageJson.publicKey !== this.senderPublicKey) {
                errors.push("Publickey in package.json does not match the senders publicKey.");
                break;
            }
            //console.log("TO STRING");
            //console.log(file.content.toString('utf8'));
            //update the account in the database with the new package version.
            store.account.set(sender.address, sender);
       };
    };//);
    return errors;
}

console.log(callIpfsGet())

//return callIpfsGet();
