import REGISTRY_CONTRACT_ABI from "../abis/RegistryContract.json";
import config from "../config";
import { RegistryContract } from "../utils/contractTypes/RegistryContract";
import {ethers} from "ethers";
import {appendLeaf} from "./merkleTree";
import {isSignatureValid} from "../utils/bls"
import {RegistrationCredentials} from "../utils/types"
import * as bigintConversion from "bigint-conversion";


  export const register = async (regCredentials: RegistrationCredentials): Promise<boolean> => {

    // console.log("reg credentials", regCredentials);

    const registryContract = getRegistryContract();

    const response = await registryContract
    .register(
      regCredentials.pubKey,
      regCredentials.idCommitment,
      regCredentials.signature,
    );

    const receipt: ethers.ContractReceipt = await response.wait(1);
    // console.log("user registered: ", receipt);
    return receipt.status ? true : false;
  };

  export const listenForMembershipEvents = async () => {
    const registryContract = getRegistryContract();

    registryContract.on(
      "RegistrationEvent",
      async (pubkey: any, idCommitment: any, signature: string) => {

        console.log("RegistrationEvent received!");

        const idCommitmentBytes: Uint8Array = ethers.utils.arrayify(idCommitment);

        if(isSignatureValid(signature, pubkey, idCommitmentBytes)) {
          // TODO: Check if the pubkey belongs to a valid ETH2 validator

          const idCommitmentBI: bigint = bigintConversion.bufToBigint(idCommitmentBytes);
          const idCommitmentString: string = idCommitmentBI.toString();

          try {
            await appendLeaf(idCommitmentString)
          } catch(e) {
            console.log("Membership registration unsuccessfull: ", e)
          }

        }

      }
    );
  };

  const getRegistryContract = (): RegistryContract => {
    const provider = new ethers.providers.JsonRpcProvider(config.ETH_RPC_URL);
    const wallet = new ethers.Wallet(config.ETH_PRIVATE_KEY, provider);
    const registryContract: RegistryContract = (
      new ethers.Contract(
        config.REGISTRY_SMART_CONTRACT_ADDRESS,
        REGISTRY_CONTRACT_ABI,
        wallet
      )
    ) as RegistryContract;
    return registryContract;
  };




