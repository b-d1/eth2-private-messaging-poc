import REGISTRY_CONTRACT_ABI from "../abis/RegistryContract.json";
import config from "../config";
import { RegistryContract } from "../utils/contractTypes/RegistryContract";
import ethers from "ethers";
import {appendLeaf} from "./merkleTree";
import {isSignatureValid} from "../utils/bls"




  export const listenForMembershipEvents = async () => {
    const registryContract = getRegistryContract();

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
            await appendLeaf(idCommitmentHex)
          } catch(e) {
            console.log("Membership registration unsuccessfull: ", e)
          }

        }

      }
    );
  };

  const getRegistryContract = (): RegistryContract => {
    const provider = new ethers.providers.JsonRpcProvider(config.ETH_RPC_URL);
    const registryContract: RegistryContract = (
      new ethers.Contract(
        config.REGISTRY_SMART_CONTRACT_ADDRESS,
        REGISTRY_CONTRACT_ABI,
        provider
      )
    ) as RegistryContract;
    return registryContract;
  };




