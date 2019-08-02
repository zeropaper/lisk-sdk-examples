const ipfsClient = require('ipfs-http-client');
const path = require('path');
const workingDirectory = process.cwd();
const pkg = require(path.join(workingDirectory, './package.json'));
if (!pkg) {
    throw new Error(
        'package.json not found. Please run the command in the root folder',
    );
}

const ipfs = ipfsClient('ipfs.infura.io', '5001', { protocol: 'https' });



async function run()
{
    try {
        const filesAdded = await ipfs.addFromFs(workingDirectory, {
            recursive: true,
            ignore: [
                'src/**',
                'test/**',
                'node_modules/**',
                'tslint.json',
                'tsconfig.json',
            ],
        });

        console.log('Added files:', filesAdded);
        console.log('Last Item:', filesAdded.reverse()[0]);
    } catch (err) {
        console.log("ERROR!!!!");
        console.log(err);
    }

}

run().catch(function(error) {
        console.log("ERROOOOR");
        console.log(error);
    }).then( function (result) {
        console.log("FINISHED");
        console.log(result);
        //console.log('Last Item:', filesAdded.reverse()[0]);
    });


