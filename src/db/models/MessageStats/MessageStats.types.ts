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

export interface IMessageStats {
  nullifier: string;
  epoch: string;
  xShare: string;
  yShare: string;
  rlnIdentifier: string;
}

export interface IMessageStatsDocument extends IMessageStats, Document {}

export interface IMessageStatsModel extends Model<IMessageStatsDocument> {
  isDuplicate: typeof isDuplicate;
  isSpam: typeof isSpam;
  getSharesByEpochForUser: typeof getSharesByEpochForUser;
}
