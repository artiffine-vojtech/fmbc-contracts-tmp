# 🏗 Artiffine Monorepo

> hosting all internal codes for Artiffine corp 🚀

Originally basad on [Scaffold ETH](https://github.com/scaffold-eth/scaffold-eth)

# ⚙️ How to run

Deploy all contracts, free mint some NFTs, transfer tokens to sale contracts.

1. `yarn chain`
1. `yarn deploy:locahost` - select `FMBCToken` + `Multicall`
1. `yarn deploy:locahost` - select `FomoBullClubNFT`
1. `yarn deploy:locahost` - select `FMBCMemberSale`
1. `yarn deploy:locahost` - select `FMBCPublicSale`
1. `yarn write:localhost` - select `freeMint1FromEachLevel`
1. `yarn write:localhost:erc20` - select `transferToMemberSale`
1. `yarn write:localhost:erc20` - select `transferToPublicSale`
1. `yarn read:localhost` - to verify the setup

# 📚 Packages of the monorepo

Modules to be used in other modules:

- `@artiffine/core` - common dapp functions and contexts for React apps
- `@artiffine/lib` - helper functions and utils, can be used without React

Scripts:

- `@artiffine/metadata-generator` - generates metadata files from csv files or from provided config
- `@artiffine/websdk` - scripts to be placed on third party minting sites, opens popup (iframe) or inline widget with NFT minting containing @artiffine/frontend

Application Frontends:

- `@artiffine/app` - Main Artiffine product. Dashboard for launching new collections, managing metadata, seeing their performace and toggle their state.
- `@artiffine/console` - Deprecated. React time dashboard for projects owners to see smart contract state, and interact with it
- `@artiffine/frontend` - NFT minting process, to be placed in an iframe to any website

Smart contracts:

- `@artiffine/hardhat` - All smart contracts for Artiffine projects
- `@artiffine/hardhat-types` - Generated typescript types using @typechain/hardhat from @artiffine/hardhat project

# 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

You also need to create `.env` file with variables from `packages/hardhat/hardhat.config.ts`.

> this guide is to run the main Dashboard dapp, see readmes of other subprojects for guides how to run them

```bash
# Install dependencies
yarn install

# Start up the Hardhat Network
yarn chain
```

Here we just install the npm project's dependencies, and by running `yarn chain` we spin up an instance of Hardhat Network that you can connect to using MetaMask. In a different terminal in the same directory, run:

```bash
# Deploy new instances of smart contract to local network
yarn deploy:localhost
```

This will deploy the contract to Hardhat Network. After this completes run:

```bash
# Start up the CRA app dashboard
# Make sure to correctly setup
yarn dev:app
```

This will start up the Create React development server and your site will be available at http://localhost:3000/

To interact with the local contract, be sure to switch your MetaMask Network to `Localhost 8545`

📱 Open http://localhost:3000 to see the app

# How to deploy new minting dApp

Deploy the contract:

1. cd `packages/hardhat`
1. Implement project config in `packages/hardhat/scripts/config/{chainName}`, export the right config
1. Make sure right PRIVATE_KEY is exported from `packages/hardhat/.env/vars.ts`
1. Run `yarn deploy:{chainName}`, confim gas fees, copy the address of the deployed contract
1. Add the address to config file in `packages/hardhat/scripts/config/{chainName}`. Read and write scripts will use this address from now on.
1. Run `yarn read:{chainName}` to ensure the client config

Configure the contract

1. Run `yarn write:{chainName}`
   - setBaseURI(), setContractURI(), enableSale()
1. Run `yarn read:{chainName}` to ensure the client config

Configure the frontend

1. Fill config to `packages/frontend/src/constants/config/{projectName}.ts`, add contract address
1. Build and deploy
