import { init, PublicKey,  Signature } from "@chainsafe/bls";

init("herumi");

export const isSignatureValid = (signatureHex: string, pubKeyHex: string, message: Uint8Array ): boolean => {
    const signature = Signature.fromHex(signatureHex);
    const pubkey = PublicKey.fromHex(pubKeyHex);
    return signature.verify(pubkey, message)
}