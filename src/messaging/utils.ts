import protobufjs from "protobufjs";
import { WakuMessage as WakuMessageType } from "../utils/types";
import config from "../config";
import MessageStats from "../db/models/MessageStats/MessageStats.model";
import { genEpoch } from "../rln/utils";

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
      const RateLimitProof = root.lookupType(
        "rlnmessages.RateLimitProof"
      ) as protobufjs.Type;
      const WakuMessage = root.lookupType(
        "rlnmessages.WakuMessage"
      ) as protobufjs.Type;

      const messageTypes: MessageTypes = {
        RateLimitProof,
        WakuMessage,
      };
      resolve(messageTypes);
    });
  });
};

export const isDuplicate = async (
  message: WakuMessageType,
  recipientIdCommitment: string
): Promise<boolean> => {
  const nullifier: string =
    message.rateLimitProof?.nullifier.toString() as string;
  const xShare: string = message.rateLimitProof?.shareX.toString() as string;
  const yShare: string = message.rateLimitProof?.shareY.toString() as string;

  return await MessageStats.isDuplicate(
    config.RLN_IDENTIFIER,
    genEpoch(),
    nullifier,
    xShare,
    yShare,
    recipientIdCommitment
  );
};

export const isSpam = async (
  message: WakuMessageType,
  recipientIdCommitment: string
): Promise<boolean> => {
  const nullifier: string =
    message.rateLimitProof?.nullifier.toString() as string;

  return await MessageStats.isSpam(
    config.RLN_IDENTIFIER,
    genEpoch(),
    nullifier,
    recipientIdCommitment
  );
};

export const registerValidMessage = async (
  message: WakuMessageType,
  recipientIdCommitment: string
) => {
  const nullifier: string =
    message.rateLimitProof?.nullifier.toString() as string;
  const xShare: string = message.rateLimitProof?.shareX.toString() as string;
  const yShare: string = message.rateLimitProof?.shareY.toString() as string;

  const messageStats = new MessageStats({
    epoch: genEpoch(),
    nullifier,
    xShare,
    yShare,
    rlnIdentifier: config.RLN_IDENTIFIER,
    recipientIdCommitment,
  });

  await messageStats.save();
};

export const isEpochValid = async (epoch: Buffer) => {
  return epoch.toString() === genEpoch();
};
