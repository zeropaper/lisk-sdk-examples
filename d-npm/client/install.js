//var packageName = process.argv[2];
//var packageVersion = process.argv[3] ? process.argv[3] : "latest";
const [name, version] = process.argv[2].split('@');

console.log("name: " + name);
console.log("version: " + version);


// make API call and search accounts asset.packages for package.name = packageName

// search packageVersion in package version list

// get IPFS hash of package version

// make ipfs request to get files from hash

// copy files to node_modules folder
