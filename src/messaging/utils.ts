import protobufjs from "protobufjs"
import {WakuMessage as WakuMessageType} from "../utils/types"
import { Rln, genSignalHash, genExternalNullifier, FullProof } from "@libsem/protocols"
import config from "../config"
import MessageStats from "../db/models/MessageStats/MessageStats.model";
export interface MessageTypes {
  RateLimitProof: protobufjs.Type;
  WakuMessage: protobufjs.Type;
}

export const getMessageTypes = async (): Promise<MessageTypes> => {

  return new Promise((resolve, reject) => {



    protobufjs.load("./rln_messages.proto", (err, root) => {
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


export const isDuplicate = async (message: WakuMessageType): Promise<boolean> => {

  const nullifier: string = <string> message.rateLimitProof?.nullifier.toString()
  const xShare: string = <string> message.rateLimitProof?.shareX.toString()
  const yShare: string = <string> message.rateLimitProof?.shareY.toString()

  return await MessageStats.isDuplicate(
    config.RLN_IDENTIFIER,
    genExternalNullifier("123"),
    nullifier,
    xShare,
    yShare
  );

}

export const isSpam = async (message: WakuMessageType): Promise<boolean> => {

  const nullifier: string = <string> message.rateLimitProof?.nullifier.toString()

  return await MessageStats.isSpam(
    config.RLN_IDENTIFIER,
    genExternalNullifier("123"),
    nullifier
  );


}

export const registerValidMessage = async (message: WakuMessageType) => {

  const nullifier: string = <string> message.rateLimitProof?.nullifier.toString()
  const xShare: string = <string> message.rateLimitProof?.shareX.toString()
  const yShare: string = <string> message.rateLimitProof?.shareY.toString()

  const messageStats = new MessageStats({
    epoch: genExternalNullifier("123"),
    nullifier: nullifier,
    xShare: xShare,
    yShare: yShare,
    rlnIdentifier: config.RLN_IDENTIFIER
  })

  await messageStats.save();

}