import { useEffect, useRef, useState } from "react";
import initWeb3 from "./utils/web3";
import { abi, contractAddress } from "./utils/lottery";
const { ethereum } = window;

function App() {
  const lotteryContract =   useRef(null);
  const [web3, setWeb3] = useState(null);
  const [doneCheckingForMetaMask, setDoneCheckingForMetaMask] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isRinkebyChain, setIsRinkebyChain] = useState(false);

  const [manager, setManager] = useState("");
  const [balance, setBalance] = useState("");
  const amtRef = useRef()
  useEffect(() => {
    let cancelled = false;
    
    async function initWeb3WithProvider() {
      if (web3 === null) {
        if (!cancelled) {
          setDoneCheckingForMetaMask(false);
          const web3Instance = await initWeb3();
          setWeb3(web3Instance);

          // Transactions done in this app must be done on the Rinkeby test network.
          const chainId = await ethereum.request({ method: 'eth_chainId' });
          if (chainId === "0x4") {
            setIsRinkebyChain(true);
          }
          
          setDoneCheckingForMetaMask(true);
          
          if (web3Instance !== null) {
            // Create Contract JS object.
            lotteryContract.current = new web3Instance.eth.Contract(abi, contractAddress);
            
            // Check to see if user is already connected.
            try {
              const accounts = await ethereum.request({ method: "eth_accounts" });
              console.log("accounts lenght ",accounts);
              if (accounts.length > 0 && ethereum.isConnected()) {
                setConnected(true);
              }
            } catch (error) {
              console.error(error);
            }
              
            // Implement `accountsChanged` event handler.
            ethereum.on("accountsChanged", handleAccountsChanged);
          }
        }
      }
    }

    initWeb3WithProvider();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;

    console.log("inside in ",connected );
    if (connected) {
      async function handler() {
        const manager = await lotteryContract.current.methods.manager().call();
        console.log("setting manager ",manager,cancelled);
        if (!cancelled) {
          setManager(manager);
          await updatePlayersListAndBalance();
        }
      }
      handler();
    }

    return () => {
      cancelled = true;
    };
  }, [connected]);

  const getAccount = async (_event) => {
    setConnecting(true);
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {}
    setConnecting(false);
  };

  const handleAccountsChanged = (_accounts) => {
    window.location.reload();
  };
  const updatePlayersListAndBalance = async () => {
    const balance = await web3.eth.getBalance(lotteryContract.current.options.address);
    console.log("setting balance ",balance);
    setBalance(balance);
  };

  const onSubmitHandler = async (e)=>{
      e.preventDefault();
      const accounts = await web3.eth.getAccounts();
      console.log("entere value ",amtRef.current.value);
      console.log("enter");
      setstatus("trying to enter...");
      try{

        await lotteryContract.current.methods.enter().send({
          from: accounts[0],
          value: web3.utils.toWei((amtRef.current.value*0.01).toString(), "ether")
        });
      }
      catch(err){
        console.log("error in transaction",err);
      setstatus("entering failed ");
      return;
      }
      setstatus("entering sucess ");

  }
  const [status, setstatus] = useState("Waiting you to enter");
  const onClickHandler = async ()=>{
    setstatus("giving out prize ");
    const accounts = await web3.eth.getAccounts();
    await lotteryContract.current.methods.givePrize().send({
      from: accounts[0]
    });
    setstatus("hurray someone got new ether ");
    updatePlayersListAndBalance();
  }
  return (
    <div className="App">
      <p>Hello</p>
      <button onClick={getAccount}>Connect to metamask</button>
      <p>Current Prize Pool:{balance} </p>
      <p>Manager:{manager} </p>

      <form onSubmit={onSubmitHandler}>
      <label htmlFor="amt" >Amount</label>
      <input ref={amtRef} type="number" id="amt" />
      <button>Enter</button>
      </form>
      <p>{status}</p>
      <button onClick={onClickHandler}>give prize</button>
      
    </div>
  );
}

export default App;
