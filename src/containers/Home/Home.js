import React, { Component } from "react";
import web3 from '../../services/contract-utils/web3';
import musicstore from '../../services/contract-utils/musicstore';
import ipfs from '../../services/ipfs';
import "./Home.css";

import PropTypes from 'prop-types'

class Home extends Component {
  static propTypes = {
    ethereumAddress: PropTypes.string,
    IPFSHash: PropTypes.string,
    file: PropTypes.string,
    ethAddress: PropTypes.string,
    transactionHash: PropTypes.string,
    ipfsHash: PropTypes.string,
    numberOfLatestHash: PropTypes.string,
    getEthereumAddressUI: PropTypes.func,
  }

  state = {
    IPFSHash: "",
    file: "",
    ethAddress: "",
    transactionHash: "",
    ipfsHash: "",
    numberOfLatestHash: "",
  }

  componentWillMount = async () => {
    const {
      getEthereumAddressUI
    } = this.props

    console.log(this.props)
    getEthereumAddressUI()

    console.log(this.props)
    //this.getAccount();
    await this.getLatestUpload()
    this.getSongLocationFromEthereum(this.state.numberOfLatestHash-1)
  }

  getLatestUpload = async () => {
    const accounts = await web3.eth.getAccounts();
    let number = await musicstore.methods.getNumberOfHashes().call({
      from: accounts[0]
    })

    console.log(number)
    this.setState({numberOfLatestHash: number})
  }

  // getAccount = async () => {
  //   const accounts = await web3.eth.getAccounts();
  //   this.setState({ethereumAddress: accounts[0]})
  // }

  getSongLocationFromEthereum = async (number) => {
    const accounts = await web3.eth.getAccounts();

    let hash = await musicstore.methods.getHashByNum(number).call({
      from: accounts[0]
    })

    this.setState({IPFSHash: hash})

    console.log(hash)
  }

  playAudio = async () => {
    const musicFile = await ipfs.get(this.state.IPFSHash)
    
    new Audio(`https://ipfs.infura.io/ipfs/${this.state.IPFSHash}`).play()
    console.log("Done")
  }

  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()

    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)
  };

  convertToBuffer = async (reader, folderPath) => {
    const buffer = await new Buffer(reader.result, 'binary');
    this.setState({file: buffer});
  };

  onSubmit = async (event) => {
    event.stopPropagation()
    event.preventDefault()
    const accounts = await web3.eth.getAccounts();
    const ethAddress = await musicstore.options.address;
    this.setState({ethAddress});
    console.log('Sending from Metamask account: ' + accounts[0]);

    await ipfs.add(this.state.file, (err, ipfsHash) => {
      if (err) { throw err }
      this.setState({ ipfsHash: ipfsHash[ipfsHash.length-1].hash});

      musicstore.methods.upload(this.state.ipfsHash).send({
        from: accounts[0] 
      }, (error, transactionHash) => {
        this.setState({transactionHash});
      });
    })
  }

  render(){
    const {
      ethereumAddress
    } = this.props

    return(
      <div>
        <h1> Home! </h1>
        <h1>EthAddress: {ethereumAddress} </h1>
        <h1>IPFSHash: {this.state.IPFSHash} </h1>

        <form onSubmit={this.onSubmit}>
            <input 
              name = "Submit Folder"
              type = "file"
              onChange = {this.captureFile}
            />
            <button 
              type="submit"> 
              Upload Game to IPFS
            </button>
          </form>

          <h3>ContractAddress: {this.state.ethAddress} </h3>
          <h3>IPFSHash: {this.state.ipfsHash} </h3>
          <h3>TransactionHash: {this.state.transactionHash} </h3>
          
          <button 
              onClick={this.playAudio}> 
              Play Audio
          </button>
      </div>
    );
  }
}

export default Home;



//  https://remix.ethereum.org/
//  contract address: 0xcb0dea41c465872101bb902d44d9cb4a7c6e53f3