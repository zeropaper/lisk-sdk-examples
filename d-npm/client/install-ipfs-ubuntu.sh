#!/bin/bash
wget https://dist.ipfs.io/go-ipfs/v0.4.21/go-ipfs_v0.4.21_linux-amd64.tar.gz -O go-ipfs_v0.4.21_linux-amd64.tar.gz
tar xzf go-ipfs_v0.4.21_linux-amd64.tar.gz
cd go-ipfs
chmod +x install.sh
./install.sh
cd ..
rm go-ipfs_v0.4.21_linux-amd64.tar.gz
ipfs init
ipfs daemon
