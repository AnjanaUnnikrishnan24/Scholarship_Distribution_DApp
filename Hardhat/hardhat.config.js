require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork:"localhost",
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true   
    }
  },
  networks:{
    localhost:{
      url:"http://127.0.0.1:8545/"
    }, 
    sepolia:{
      url:`https://eth-sepolia.g.alchemy.com/v2/${process.env.SEPOLIA_KEY}`,
      accounts:[process.env.PRIVATE_KEY]
    },
    hoodi:{
      url:`https://eth-hoodi.g.alchemy.com/v2/${process.env.HOODI_KEY}`,
      accounts:[process.env.PRIVATE_KEY]
    }
  }
};
