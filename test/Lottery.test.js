// contract test code will go here
const ganache = require("ganache-cli");
const assert = require("assert")
const Web3 = require("web3");
const { abi, evm } = require("../compile");
const web3 = new Web3(ganache.provider());
let accounts;
let lottery;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: "0x" + evm.bytecode.object }).send({from:accounts[0],gas:"1000000"});
});
describe("lottery contract", () => {
  it("deploy contract", async () => {
    assert.ok(lottery.options.address);
  });
  it("enter to lottery",async ()=>{
    await lottery.methods.enter().send({from:accounts[1],value:web3.utils.toWei("0.2","ether")});
  });
  it("no money enter to lottery",async ()=>{
    try{
      
      await lottery.methods.enter().send({from:accounts[1]});
      assert(false)
    }
    catch (error){
      assert(error);
    }
    
  });
  it("giving out money ",async ()=>{
    await lottery.methods.enter().send({from:accounts[1],value:web3.utils.toWei("1","ether")});
    const initialBalance = await web3.eth.getBalance(accounts[1]);
    await lottery.methods.givePrize().send({
      from: accounts[0]
    });
    const finalBalance = await web3.eth.getBalance(accounts[1]);
    const difference = finalBalance - initialBalance;
    assert(difference>web3.utils.toWei("0.5", "ether"))
  });

});
