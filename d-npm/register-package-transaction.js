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
      errors.push(new TransactionError("oopps not the same person"));
    }

    // if sender is the owner of the package.
    const sender = store.account.get(this.senderId);

    if (!sender.asset.packages) {
      sender.asset.packages = [];
    }

    let pkg = sender.asset.packages.find(item => item.name === this.asset.name);

    if (!pkg) {
      pkg = {
        name: this.asset.name,
        versions: []
      };

      sender.asset.packages.push(pkg);
    }

    const versionObj = pkg.versions.find(
      item =>
        item.version === this.asset.hash || item.version === this.asset.version
    );

    if (versionObj) {
      errors.push(new TransactionError("oops hash or version"));
    }

    pkg.versions.push({
      version: this.asset.version,
      hash: this.asset.hash
    });

    // verify against ipfs,
    // package.json should contain the publicKey of the owner

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
