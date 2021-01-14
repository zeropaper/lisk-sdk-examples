const { Application, MonitorPlugin, genesisBlockDevnet, configDevnet, utils } = require('lisk-sdk');

const appConfig = utils.objects.mergeDeep({}, configDevnet, {
  label: 'my-app',
  rpc: {
    enable: true,
    mode: "ws",
    port: 8080
  },
  plugins: {
    monitor: {
      port: 4003,
      whiteList: ['127.0.0.1'],
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT'],
      },
      limits: {
        max: 0,
        delayMs: 0,
        delayAfter: 0,
        windowMs: 60000,
        headersTimeout: 5000,
        serverSetTimeout: 20000,
      },
    },
  }
});

const app = Application.defaultApplication(genesisBlockDevnet, appConfig);

app.registerPlugin(MonitorPlugin);

app
  .run()
  .then(() => app.logger.info('App started...'))
  .catch(error => {
    console.error('Faced error in application', error);
    process.exit(1);
  });
