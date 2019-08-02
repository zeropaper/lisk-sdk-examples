const { Application, genesisBlockDevnet, configDevnet } = require('lisk-sdk');
const RegisterPackageTransaction = require('./register-package-transaction');

configDevnet.app.label = 'D-NPM-application';
configDevnet.modules.http_api.access.public = true;

const app = new Application(genesisBlockDevnet, configDevnet);

app.registerTransaction(RegisterPackageTransaction);

app
    .run()
    .then(() => app.logger.info('App started...'))
.catch(error => {
    console.error('Faced error in application', error);
process.exit(1);
});
