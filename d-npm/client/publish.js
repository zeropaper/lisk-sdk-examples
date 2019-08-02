const {
    flags: { endpoint, port, protocol },
} = this.parse(PackagePublishCommand);
const workingDirectory = process.cwd();
const pkg = require(path.join(workingDirectory, './package.json'));
if (!pkg) {
    throw new Error(
        'package.json not found. Please run the command in the root folder',
    );
}
console.log({ endpoint, port, protocol });
const ipfs = ipfsClient(endpoint, port, { protocol });
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
