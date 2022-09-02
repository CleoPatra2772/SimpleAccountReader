import { useState, useEffect } from "react";
import Web3 from 'web3';
import {ABI, contractAddress} from '../ABI_Contract';
import './Info.styles.css';

export const Info = () => {
    const [ networkID, setNetworkID ] = useState('');

    const [network, setNetwork] = useState('');
  
    const [ account, setAccount ] = useState({accountId:'', balance: 0});
  
    const [ name, setName ] = useState('');
    const [ symbol, setSymbol ] = useState('');
    const [ decimals, setDecimals ] = useState('');
    const [ totalSupply, setTotalSupply ] = useState('');
    const [ totalBalance, setTotalBalance ] = useState('');
    const [ minter, setMinter ] = useState('');
  
    const refresh = async () => {
      window.location.reload();
    }
  
    const getToken = async () => {
      let w3 = null;
      if(window.ethereum != null){
        w3 = new Web3( window.ethereum)
        console.log('web 3', w3)
        await window.ethereum.enable()
      }else{
        alert('Please install MetaMask to use this dApp');
      
      return;
      }
    
  
    const accounts = await w3.eth.getAccounts();
    console.log('All accounts >', accounts);
    const tc = new w3.eth.Contract(ABI, contractAddress);
  
    const name = await tc.methods.name().call();
    const symbol = await tc.methods.symbol().call();
    const totalSupply = await tc.methods.totalSupply().call();
    const decimals = await tc.methods.decimals().call();
    const minter = await tc.methods._minter().call();
    const totalBalance = await tc.methods.balanceOf(accounts[0]).call();
  
    setName(name);
    setSymbol(symbol);
    setTotalSupply( totalSupply);
    setDecimals(decimals);
    setMinter(minter);
    setTotalBalance(totalBalance);
    }
    const loadBlock = async () => {
      let web3 = null;
  
      try{
        if(window.ethereum != null){
          web3 = new Web3(window.ethereum)
          console.log('web 3', web3)
          await window.ethereum.enable()
        } else {
          alert('Pleasse install MetaMask to use this dApp');
          return;
        }
        const networkType = await web3.eth.net.getNetworkType();
        console.log('Network is: ', networkType);
        console.log('check ABI', ABI, contractAddress);
        setNetwork(networkType);
  
        const networkID = await web3.eth.net.getId();
  
        setNetworkID(networkID);
  
        const accounts = await web3.eth.getAccounts();
        const balance = await web3.eth.getBalance(accounts[0]);
        setAccount({accountId: accounts[0], bal: balance/1e18});
  
        const blockInfo = await web3.eth.getBlock('latest');
  
        console.log('block info: ', blockInfo); 
  
      } catch(err) {
        console.log(err);
      }
  
  
    }
    useEffect(() => {
        loadBlock();
      }, []);

    return(
        <div className='home-container'>
            <div className="basic-info">
            <h2>React/ JS / React / MetaMask / BlockChain / Solidity Smart Contract</h2>
            <p>Netid: <span>{networkID}</span></p>
            <p>Net Type: <span>{network}</span></p>
            <p>My Account: <span className="important-info">{account.accountId} </span></p>
            <p>My Balance: <span className="important-info">{account.bal}</span>ETH</p>
            <br></br>
            <p>Token name: <span>{name}</span></p>
            <p>Symbol: <span>{symbol}</span></p>
            <p>Minter: <span>{minter}</span></p>
            <p>Total Balance: <span>{totalBalance}</span></p>
            <p>Total Supply: <span>{totalSupply}</span></p>

            </div>

            <div className="btngroup">
                <button class="btn2" onClick={() => refresh()} >Refresh </button>
                <button class="btn2" onClick={ () => getToken()}>Token</button>
                </div>
            
        </div>
    )
}