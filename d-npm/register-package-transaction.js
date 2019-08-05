const {
  transactions: { BaseTransaction, TransactionError }
} = require("lisk-sdk");
const ipfsClient = require('ipfs-http-client');
const util = require('util');

const ipfs = ipfsClient('ipfs.infura.io', '5001', { protocol: 'https' });

class RegisterPackageTransaction extends BaseTransaction {
  static get TYPE() {
    return 21;
  }

  static get FEE() {
    return `0`;
  }



  applyAsset(store) {
    const errors = [];

    // if somebody else published a package with same name, Reject
    const account = store.account.find(
      account =>
        account.asset.packages &&
        account.asset.packages.find(pkg => pkg.name === this.asset.name)
    );

    if (account && account.address !== this.senderId) {
      errors.push(new TransactionError("This package name is already registered by account ", account.address));
      return errors;
    }

    // the sender is the owner of the package.
    const sender = store.account.get(this.senderId);

    // create new packages list in accounts asset field, if it doesn't exist, yet.
    if (!sender.asset.packages) {
      sender.asset.packages = [];
    }

    // Search the packages list, if a package with the name is already present.
    let pkg = sender.asset.packages.find(item => item.name === this.asset.name);

    // if the package name is not present already, it is created newly.
    if (!pkg) {
      pkg = {
        name: this.asset.name,
        versions: []
      };

      // and then added to the packages list of the account.
      sender.asset.packages.push(pkg);
    }

    /* Search the versions list of the package:
     * - check if the version for this package hasn't been registered already.
     * - check if the same hash has been already registered under a different version.
     */
    const versionObj = pkg.versions.find(
      item =>
        item.hash === this.asset.hash || item.version === this.asset.version
    );

    if (versionObj) {
      errors.push(new TransactionError("Error: Either the version for this package has already been registered, or the package has been registered under a different version number already."));
      return errors;
    }

    // create a new version object with IPFS hash in the version list of the package
    pkg.versions.push({
      version: this.asset.version,
      hash: this.asset.hash
    });

    // verify against ipfs,
    // package.json should contain the publicKey of the owner
    const packageJsonHash = this.asset.hash + "/package.json";

    /*function getStuffAsync(param) {
        return new Promise(function(resolve, reject) {
            getStuff(param, function(err, data) {
                if (err !== null) reject(err);
                else resolve(data);
            });
        });
    }*/
    debugger;
    const ipfsGet = util.promisify(ipfs.get);

    async function callIpfsGet(x) {
        let files;
        try {
            files = await ipfsGet(packageJsonHash);

        }
        catch(error) {
            if (!files || files.length < 1) {
                errors.push(new TransactionError("No files found under provided hash."));
            };
        }
        for(var i = 0; i < files.length; i++) {
        //files.forEach((file) => {
            console.log(files[i].path);
            if (!files[i].content) {
                errors.push(new TransactionError("No package.json file found unde provided hash."));
                break;
            };
            let packageJson = JSON.parse(files[i].content.toString('utf8'));
            console.log("name");
            console.log(packageJson.name);
            console.log(packageJson.version);
            if (!packageJson.publicKey) {
                errors.push(new TransactionError("No publicKey found in package.json file."));
                break;
            }
            if (packageJson.publicKey !== this.senderPublicKey) {
                errors.push(new TransactionError("Publickey in package.json does not match the senders publicKey."));
                break;
            }
            //console.log("TO STRING");
            //console.log(file.content.toString('utf8'));
            //update the account in the database with the new package version.
            store.account.set(sender.address, sender);

        };//);
        return errors;
    }

    return callIpfsGet();

    /*return ipfs.get(packageJsonHash, function (err, files) {
        files.forEach((file) => {
            console.log(file.path);
            if (file.content) {
              const packageJson = JSON.parse(file.content.toString('utf8'));
              console.log("name");
              console.log(packageJson.name);
              console.log(packageJson.version);
              if (!packageJson.publicKey) {
                  errors.push(new TransactionError("No publicKey found in package.json file."));
                  return errors;
              }
              if (packageJson.publicKey !== this.senderPublicKey) {
                  errors.push(new TransactionError("Publickey in package.json does not match the senders publicKey."));
                  return errors;
              }
              //console.log("TO STRING");
              //console.log(file.content.toString('utf8'));
              //update the account in the database with the new package version.
              store.account.set(sender.address, sender);
              //return errors;
            };
        });
        return errors;
    });*/


  }

  undoAsset(store) {
    const sender = store.account.get(this.senderId);

    // Search the packages list, if a package with the name is already present.
    let pkg = sender.asset.packages.find(item => item.name === this.asset.name);

    // Rollback package registration
    pkg = pkg.versions.length === 1 ? undefined : pkg.versions.splice(
      pkg.versions.indexOf(this.id),
      1,
    );

    // get the package version that needs to be removed. If only one version is in the list, simply set it to undefined.
    pkgVersion = pkg.versions.length === 1 ? undefined : pkg.versions.find(packageVersion => packageVersion.version === this.asset.version);

    // if version list is undefined, remove the package from the asset.packages list of the account. If the last package got removed, set asset.packages to undefined.
    if (pkgVersion) {
      pkg.versions.splice(
          pkg.versions.indexOf(pkgVersion),
          1,
      );
      sender.asset.packages[sender.asset.packages.indexOf(this.asset.name)] = pkg;
    } else {
      sender.asset.packages = sender.asset.packages.length < 1 ? undefined : sender.asset.packages;
      sender.asset.packages.splice(
          sender.asset.packages.indexOf(this.asset.name),
        1,
      );
    }

    //
    store.account.set(sender.address, sender);
    return [];
  }

  validateAsset() {
    const errors = [];
    return errors;
  }

  // Server
  async prepare(store) {
    const { name } = this.asset;
    await store.account.cache([
      {
        address: this.senderId
      },
      {
        asset_contains: name
      }
    ]);
  }
}

module.exports = RegisterPackageTransaction;
