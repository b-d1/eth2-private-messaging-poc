import protons from "protons";

export const appContentTopic = "/eth2-validators/1/chat/proto";
export const messageTypes = protons(`

message RateLimitProof {
    bytes proof = 1;
    bytes merkle_root = 2;
    bytes epoch = 3;
    bytes share_x = 4;
    bytes share_y = 5;
    bytes nullifier = 6;
  }

message WakuMessage {
    bytes payload = 1;
    string contentTopic = 2;
    uint32 version = 3;
    double timestamp = 4;
    RateLimitProof rate_limit_proof = 21;
}
`);