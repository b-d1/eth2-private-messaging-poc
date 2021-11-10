import { Rln, genExternalNullifier } from "@libsem/protocols";
import { ZkIdentity } from "@libsem/identity";
import { RLNcredentials } from "../utils/types";
import poseidonHash from "../utils/hasher";
import { getUTCtimestampByMinute } from "../utils/utils";

const genRlnIdentifier = (): string => {
  const identifier = Rln.genIdentifier();
  return identifier.toString();
};

const genRLNcredentials = (): RLNcredentials => {
  const identity: ZkIdentity = new ZkIdentity();
  identity.genSecretFromIdentity();
  const idCommitment: bigint = identity.genIdentityCommitment();
  const secret: BigInt = poseidonHash(identity.getSecret());

  return {
    secret: secret.toString(),
    idCommitment: idCommitment.toString(),
  };
};

const genEpoch = (): string => {
  const timestamp = getUTCtimestampByMinute();
  const epoch = genExternalNullifier(timestamp.toString());
  return epoch;
  // return genExternalNullifier("1234");
};

export { genRlnIdentifier, genRLNcredentials, genEpoch };
