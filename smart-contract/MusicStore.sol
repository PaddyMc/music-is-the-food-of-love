pragma solidity ^0.4.24;

contract MusicStore {
    
    struct MusicData {
        address owner;
        string ipfsHash;
    }

    mapping(uint256 => MusicData) allMusicData;
    uint256 number = 0;

    function upload(string ipfsHash) public returns (string) {
        //require(ipfsHash=> validate);
        MusicData memory gamedata = MusicData(msg.sender, ipfsHash);
        allMusicData[number] = gamedata;
        number++;
       
        return ipfsHash;
    }

    function getHashByNum(uint256 position) public view returns (string) {
        //require(ipfsHash=> validate);
        MusicData storage gamedata = allMusicData[position];
        return gamedata.ipfsHash;
    }

    function getNumberOfHashes() public view returns (uint256) {
        return number;
    }
}