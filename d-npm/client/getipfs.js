const ipfsClient = require('ipfs-http-client');

const ipfs = ipfsClient('ipfs.infura.io', '5001', { protocol: 'https' });
const hash = "QmcSsFettYxTi4i23cLatfH41swoKgpu5RgYVB74bX9mgu";
const packageJson = "QmcSsFettYxTi4i23cLatfH41swoKgpu5RgYVB74bX9mgu" + "/package.json";

const ipfsPkg = ipfs.get(packageJson, function (err, files) {
    files.forEach((file) => {
        console.log(file.path);
        if (file.content) {
            console.log("name");
            console.log(JSON.parse(file.content.toString('utf8')).name);
            console.log(JSON.parse(file.content.toString('utf8')).version);
            console.log("TO STRING");
            console.log(file.content.toString('utf8'));
    };
    })
});
