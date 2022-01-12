// deploy code will go here
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require("./compile");

const provider = new HDWalletProvider(
    'tornado spin next sister foam surround lesson verify input income skull stuff',
    'https://rinkeby.infura.io/v3/ede881bf5e9b47f08eebe3c62988b7eb'
);
const web3 = new Web3(provider);
const deploy= async ()=>{
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(abi)
    .deploy({data: "0x" + evm.bytecode.object}).send({from:accounts[0],gas:"1000000"});
    console.log("contact deployed at ",inbox.options.address);
    provider.engine.stop();
};
deploy();
