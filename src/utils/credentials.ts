import { RegistrationCredentials } from "./types";
import * as bigintConversion from "bigint-conversion";

import { PublicKey, SecretKey } from "@chainsafe/bls";

export const getRegistrationCredentials = (
  idCommitment: string,
  blsPrivateKey: string,
  blsPublicKey: string
): RegistrationCredentials => {
  const idCommitmentBI: bigint = BigInt(idCommitment);
  const idCommitmentBytes: Uint8Array = new Uint8Array(
    bigintConversion.bigintToBuf(idCommitmentBI)
  );

  const pubkey = PublicKey.fromHex(blsPublicKey);
  const secretKey = SecretKey.fromHex(blsPrivateKey);

  const signature = secretKey.sign(idCommitmentBytes);

  return {
    signature: signature.toBytes(),
    pubKey: pubkey.toBytes(),
    idCommitment: idCommitmentBytes,
  };
};
