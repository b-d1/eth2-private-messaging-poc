# ETH2 Validator private messaging PoC (WIP)

## Description

Minimal bare-bone example which implements a messaging client for a [Private message sharing channel for ETH2 validators](https://ethresear.ch/t/private-message-sharing-for-eth2-validators/10664). It demos how the clients can register and share messages with various content anonymously. For the messaging part the [Waku V2](https://rfc.vac.dev/spec/10/) protocol is used, more specifically the [Waku-js](https://github.com/status-im/js-waku) implementation. The RLN messages are implemented outside of the library, but according to the [Waku RLN-Relay](https://rfc.vac.dev/spec/17/) protocol. The goal is to implement all of the things related to RLN inside the RLN-Relay protocol, as part of the Waku-js library.
Currently only the basic flow is implemented, without verifying that the clients are active ETH2 validators. The same BLS signature stnadard is used as in the ETH2 spec. 

### Implementation spec

The spam limit is set to 1, thus the users will be slashed if they send more than 1 message per epoch. The epoch choice is a UNIX UTC timestamp representation of the minute that the message is being sent in.
Merkle tree of depth 32 is being used. MongoDB is being used for storing the Membership merkle tree at each peer. Additionally database domain separation is implemented, so multiple clients can be hosted on the same machine.
RLN circuits from the following repository are used: https://github.com/appliedzkp/rln.  

For membership registration, each peer listens to events from the [RegistryContract](). Upon each received event, the signature is validated an the id commitment is inserted into the peer's membership merkle tree, if the user is not already registered and if the user is not banned.

The above parameters are used just for demo purposes, they should be tweaked for in-production usage.

## Requirements

- RPC access to Ethereum node (for `RegistryContract` events)
- MongoDB connection
- (Soon) Being an active ETH2 validator


## Test usage

- Copy `.env.example` into `.env` and set it up properly
- Deploy the [RegistryContract](https://github.com/bdim1/eth2-private-messaging-registry-contract), to a local network (After cloning and installing the dependencies from the `RegistryContract` repository, start a local chain: `yarn chain` and deploy the contract `yarn deploy --network localhost`).
- `docker-compose up -d` (this will run a test mongodb instance)
- `yarn install`
- `yarn test basic` || `yarn test spam`


## TODO

- ETH2 client integration
- Better parameter configuration
- Implementing the RLN-Relay protocol into [Waku-js](https://github.com/status-im/js-waku), and relying on [Waku-js](https://github.com/status-im/js-waku) for almost all of the operations
- Write more integration tests and test in a demo network.
