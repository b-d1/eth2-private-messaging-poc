 
  enum WakuMessageStatus {
    DUPLICATE = "duplicate", // the message is duplicate, we should not process it further
    SPAM = "spam", // the message is considered as spam, the user should be slashed
    INVALID = "invalid", // the message is invalid, the message should be discarded
    VALID = "valid", // the message is valid, it should be processed further
  }

  interface RateLimitProof {
    proof: string; 
    merkleRoot: string;
    epoch: string;
    xShare: string;
    yShare: string;
    nullifier: string;
  }
  
  interface WakuMessage {
    payload: string; 
    contentTopic: string;
    version: number;
    timestamp: string; 
    rateLimitProof: RateLimitProof; 
  }

  interface RLNcredentials {
      secret: string;
      idCommitment: string;
  }

  export { WakuMessageStatus, RateLimitProof, WakuMessage, RLNcredentials};