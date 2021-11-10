enum InitUserType {
  NEW = "new", // always initialize the client with a new user
  EXISTING = "existing", // initialize with a registered user, or register a new user if the user doesn't exists
}

enum WakuMessageStatus {
  DUPLICATE = "duplicate", // the message is duplicate, we should not process it further
  SPAM = "spam", // the message is considered as spam, the user should be slashed
  INVALID = "invalid", // the message is invalid, the message should be discarded
  VALID = "valid", // the message is valid, it should be processed further
}

interface RateLimitProof {
  proof: Buffer;
  merkleRoot: Buffer;
  epoch: Buffer;
  shareX: Buffer;
  shareY: Buffer;
  nullifier: Buffer;
}

interface WakuMessage {
  payload: Buffer;
  contentTopic: string;
  version: number;
  timestamp: number;
  rateLimitProof?: RateLimitProof;
}

interface RLNcredentials {
  secret: string;
  idCommitment: string;
}

interface Witness {
  root: string;
  pathElements: number[];
  indices: number[];
}

interface RegistrationCredentials {
  idCommitment: Uint8Array;
  pubKey: Uint8Array;
  signature: Uint8Array;
}

export {
  InitUserType,
  WakuMessageStatus,
  RateLimitProof,
  WakuMessage,
  RLNcredentials,
  Witness,
  RegistrationCredentials,
};
