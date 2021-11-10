import { Model, Document } from "mongoose";
import {
  isDuplicate,
  isSpam,
  getSharesByEpochForUser,
} from "./MessageStats.statics";

export interface IShares {
  xShare: string;
  yShare: string;
}

/**
 * The recipientIdCommitment field is the idCommitment of
 * the message reciever. It is only available at the recipient side, and is used for the multiple clients
 * on the same machine scenario. It serves as a domain separation for the message metadata being stored -
 * domain separation by user.
 */
export interface IMessageStats {
  nullifier: string;
  epoch: string;
  xShare: string;
  yShare: string;
  rlnIdentifier: string;
  recipientIdCommitment: string;
}

export interface IMessageStatsDocument extends IMessageStats, Document {}

export interface IMessageStatsModel extends Model<IMessageStatsDocument> {
  isDuplicate: typeof isDuplicate;
  isSpam: typeof isSpam;
  getSharesByEpochForUser: typeof getSharesByEpochForUser;
}
