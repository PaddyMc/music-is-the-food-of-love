import Home from './Home'
import { connect } from 'react-redux'
import { getEthereumAddress } from '../../actions'

const mapStateToProps = (state) => {
  const {
    ethereumAddress,
    IPFSHash,
    file,
    ethAddress,
    transactionHash,
    ipfsHash,
    numberOfLatestHash,
  } = state.home

  return {
    ethereumAddress,
    IPFSHash,
    file,
    ethAddress,
    transactionHash,
    ipfsHash,
    numberOfLatestHash,
  }
}

const mapDispatchToProps = (dispatch) => {
  return { 
    getEthereumAddressUI:  () => dispatch(getEthereumAddress())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)