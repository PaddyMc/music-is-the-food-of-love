import React, { Component } from "react";
import web3 from '../../services/contract-utils/web3';
import musicstore from '../../services/contract-utils/musicstore';
import ipfs from '../../services/ipfs';
import "./Home.css";

class Home extends Component {
  state = {
    ethereumAddress: "address",
    IPFSHash: "",
    file: "",
    ethAddress: "",
    transactionHash: "",
    ipfsHash: "",
  }

  componentWillMount = () => {
    this.getAccount();
    this.getSongLocationFromEthereum(4)
  }

  getAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ethereumAddress: accounts[0]})
  }

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
    //const hope = await new Buffer(musicFile[0].content, 'binary').toString('binary')
    console.log(musicFile)
    let context = new window.AudioContext()
    var buffer = new ArrayBuffer(musicFile[0].content.length);

    console.log(buffer)

    musicFile[0].content.map(function(value, i){buffer[i] = value});
    context.decodeAudioData(buffer, (buffer) => {
      console.log(buffer)
      // var source = context.createBufferSource()
      // source.buffer = buffer
      // source.connect(context.destination);
      // source.start();
    })
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
    return(
      <div>
        <h1> Home! </h1>
        <h1>EthAddress: {this.state.ethereumAddress} </h1>
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