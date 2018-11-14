import extend from 'xtend'
let newState

const home = (state, action) => {
  var homeState = extend({
    ethereumAddress: "address",
    IPFSHash: "",
    file: "",
    ethAddress: "",
    transactionHash: "",
    ipfsHash: "",
    numberOfLatestHash: "",
  }, state)

  switch (action.type) {
    case 'CHANGE_ETHEREUM_ADDRESS':
      newState = extend(homeState, {
        ethereumAddress: action.ethereumAddress
      })
      return newState
    default:
      return homeState
  }
}

export default home