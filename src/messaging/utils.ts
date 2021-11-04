import protobufjs from "protobufjs"

export interface MessageTypes {
  RateLimitProof: protobufjs.Type;
  WakuMessage: protobufjs.Type;
}

export const getMessageTypes = async (): Promise<MessageTypes> => {

  return new Promise((resolve, reject) => {

    protobufjs.load("./messages.proto", (err, root) => {
      if (err || !root) {
        reject(err);
        return;
      }
      const RateLimitProof = root.lookupType("rlnmessages.RateLimitProof") as protobufjs.Type;
      const WakuMessage = root.lookupType("rlnmessages.WakuMessage") as protobufjs.Type;

      const messageTypes: MessageTypes = {
        RateLimitProof,
        WakuMessage
      }
      resolve(messageTypes);

      });
  });

  }


