const { BasePlugin } = require('lisk-sdk');

class TimestampPlugin extends BasePlugin {
  static get alias() {
    return 'timestampPlugin';
  };

  static get info(){
    return {
      author: 'authorName',
      version: '0.0.1',
      name: 'packageName',
    };
  };

  _knownTimestamps = [];

  get defaults() {
    return {
      type: 'object',
      properties: {
        enable: {
          type: 'boolean',
        }
      },
    }
  };

  get events() {
    return ['timestamp'];
  };

  get actions() {
    return {
      getKnownTimestamp: () => this._knownTimestamps
    }
  };

  async load(channel) {
    // initialize plugin
    if (!this.options.enable) {
      return;
    }
    channel.subscribe('app:block:new', ({ data }) => {
      const decodedBlock = this.codec.decodeBlock(data.block);
      this.knownTimestamp.push(decodedBlock.header.timestamp);
      channel.publish('timestampPlugin:timestamp', { timestamp: decodedBlock.header.timestamp });
    });
  };

  async unload() {
    this._knownTimestamps = [];
  };
};

module.exports = { TimestampPlugin };
