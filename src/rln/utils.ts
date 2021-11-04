
import { Rln } from "@libsem/protocols"
import { ZkIdentity } from "@libsem/identity"
import { RLNcredentials } from "../utils/types";
import poseidonHash from "../utils/hasher";
const genRlnIdentifier = (): string => {
    const identifier = Rln.genIdentifier();
    return identifier.toString();
}

const genRLNcredentials = (): RLNcredentials => {
    const identity: ZkIdentity = new ZkIdentity();
    identity.genSecretFromIdentity();
    const idCommitment: bigint = identity.genIdentityCommitment();
    const secret: BigInt = poseidonHash(identity.getSecret());

    return {
        secret: secret.toString(),
        idCommitment: idCommitment.toString()
    }

}


export {genRlnIdentifier, genRLNcredentials}