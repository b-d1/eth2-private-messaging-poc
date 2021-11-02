import REGISTRY_CONTRACT_ABI from "../abis/RegistryContract.json";
import config from "../config";
import { RegistryContract } from "../utils/contractTypes/RegistryContract";
import ethers from "ethers";
import MerkleTree from "./MerkleTree";
import {isSignatureValid} from "../utils/bls"

class RegistrationEventListener {

  membershipTree: MerkleTree;

  constructor(
    membershipTree: MerkleTree,
  ) {
    this.membershipTree = membershipTree;
  }


  public listenForMembershipEvents = async () => {
    const registryContract = this.getRegistryContract();
  
    registryContract.on(
      "RegistrationEvent",
      async (pubkey: Uint8Array, idCommitment: Uint8Array, signature: Uint8Array) => {
        const pubkeyHex = ethers.utils.hexlify(pubkey)
        const signatureHex = ethers.utils.hexlify(signature);
        const idCommitmentHex = ethers.utils.hexlify(idCommitment);

        console.log("RegistrationEvent received:");
        console.log("pubkey", pubkeyHex);
        console.log("idCommitment", idCommitmentHex);
        console.log("signature", signatureHex);

        if(isSignatureValid(signatureHex, pubkeyHex, idCommitment)) {

          // TODO: Check if the pubkey belongs to a valid ETH2 validator

          try {
            await this.membershipTree.appendLeaf(idCommitmentHex)
          } catch(e) {
            console.log("Membership registration unsuccessfull: ", e)
          }
          
        }

      }
    );
  };

  private getRegistryContract = (): RegistryContract => {
    const provider = new ethers.providers.JsonRpcProvider(config.ETH_RPC_URL);
    const registryContract: RegistryContract = <RegistryContract>(
      new ethers.Contract(
        config.REGISTRY_SMART_CONTRACT_ADDRESS,
        REGISTRY_CONTRACT_ABI,
        provider
      )
    );
    return registryContract;
  };
  
}

export default RegistrationEventListener;

