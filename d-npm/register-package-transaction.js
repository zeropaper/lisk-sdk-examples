const {
  transactions: { BaseTransaction, TransactionError }
} = require("lisk-sdk");

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

    // update the account in the database with the new package version.
    store.account.set(sender.address, sender);
    return errors;
  }

  undoAsset(store) {
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
