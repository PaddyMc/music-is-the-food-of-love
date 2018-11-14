import web3 from '../services/contract-utils/web3';

const updateEthereumAddress = (ethereumAddress) => ({
  type: 'CHANGE_ETHEREUM_ADDRESS',
  ethereumAddress
})

export const getEthereumAddress = () => async (dispatch, getState) => {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts[0])
  dispatch(updateEthereumAddress(accounts[0]))
  //this.setState({ethereumAddress: accounts[0]})
}

