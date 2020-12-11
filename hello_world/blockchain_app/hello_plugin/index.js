const express = require("express");
const cors = require("cors");
const { BasePlugin } = require("lisk-sdk");
const pJSON = require("../package.json");

class HelloAPIPlugin extends BasePlugin {
  _server = undefined;
  _app = undefined;
  _hello = undefined;

  static get alias() {
    return "HelloHTTPAPI";
  }

  static get info() {
    return {
      author: pJSON.author,
      version: pJSON.version,
      name: pJSON.name,
    };
  }

  get defaults() {
    return {};
  }

  get events() {
    return [];
  }

  get actions() {
    return {};
  }

  async load(channel) {
    this._app = express();

    channel.subscribe('hello:newHello', (info) => {
      this._hello = info;
    });
    channel.subscribe("app:ready", (res) => {
      this._ready = res;
    });
    channel.subscribe("app:shutdown", (res) => {
      this._shutdown = res;
    });
    channel.subscribe("app:block:new", (res) => {
      this._blocknew = res;
    });
    channel.subscribe("app:transaction:new", (res) => {
      this._txnew = res;
    });

    channel.once("app:ready", () => {
      this._app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT"] }));
      this._app.use(express.json());

      this._app.get("/api/hello_counter", async (_req, res) => {
        const counter = await channel.invoke("hello:amountOfHellos");

        await res.json({ data: counter });
      });

      this._app.get("/api/getLastBlock", async (_req, res) => {
        const getLastBlock = await channel.invoke("app:getLastBlock");

        await res.json({ data: getLastBlock });
      });
      this._app.get("/api/getAccount", async (_req, res) => {
        const getAccount = await channel.invoke("app:getAccount",{ address: "7c1facd5a55044f4b2ec3329b8ae8382959d4d7e"});

        await res.json({ data: getAccount });
      });
      this._app.get("/api/getAccounts", async (_req, res) => {
        const getAccounts = await channel.invoke("app:getAccounts",{ address: ["7c1facd5a55044f4b2ec3329b8ae8382959d4d7e"]});

        await res.json({ data: getAccounts });
      });
      this._app.get("/api/getBlockByHeight", async (_req, res) => {
        const getBlockByHeight = await channel.invoke("app:getBlockByHeight",{ height: "123"});

        await res.json({ data: getBlockByHeight });
      });
      this._app.get("/api/getBlocksByHeightBetween", async (_req, res) => {
        const getBlocksByHeightBetween = await channel.invoke("app:getBlocksByHeightBetween",{ from: "299", to: "302" });

        await res.json({ data: getBlocksByHeightBetween });
      });
      this._app.get("/api/updateForgingStatus", async (_req, res) => {
        const updateForgingStatus = await channel.invoke(
          "app:updateForgingStatus",
          {
            address: "7c1facd5a55044f4b2ec3329b8ae8382959d4d7e",
            password: "string",
            forging: true
          });

        await res.json({ data: updateForgingStatus });
      });
      this._app.get("/api/ready", async (_req, res) => {


        await res.json({ data: this._ready });
      });
      this._app.get("/api/shutdown", async (_req, res) => {

        await res.json({ data: this._shutdown });
      });
      this._app.get("/api/block_new", async (_req, res) => {

        await res.json({ data: this._blocknew});
      });
      this._app.get("/api/tx_new", async (_req, res) => {

        await res.json({ data: this._txnew });
      });

      // Gets the latest hello message.
      // Resets when the application is restarted.
      // To retrieve a persistent latest hello message, create a new action in the hello module which returns the latest hello message by looking at the latest helloAsset transaction.
      this._app.get("/api/latest_hello", async (req, res) => {
        await res.json(this._hello);
      });

      this._server = this._app.listen(8080, "0.0.0.0");
    });
  }

  async unload() {
    await new Promise((resolve, reject) => {
      this._server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}

module.exports = { HelloAPIPlugin };
