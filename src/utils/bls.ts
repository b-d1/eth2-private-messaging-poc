import { init, PublicKey, Signature, SecretKey } from "@chainsafe/bls";

export const genBlsKeys = async () => {
  await init("herumi");

  // BLS secret and public key
  const secretKey = SecretKey.fromKeygen();
  const publicKey = secretKey.toPublicKey();

  return {
    pubkey: publicKey.toHex(),
    privkey: secretKey.toHex(),
  };
};

export const isSignatureValid = (
  signatureHex: string,
  pubKeyHex: string,
  message: Uint8Array
): boolean => {
  const signature = Signature.fromHex(signatureHex);
  const pubkey = PublicKey.fromHex(pubKeyHex);
  return signature.verify(pubkey, message);
};
