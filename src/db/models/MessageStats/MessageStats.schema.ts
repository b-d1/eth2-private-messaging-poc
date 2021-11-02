import { Schema } from "mongoose";
import {
  isDuplicate,
  isSpam,
  getSharesByEpochForUser,
} from "./MessageStats.statics";
import {
  IMessageStats,
  IMessageStatsModel,
  IMessageStatsDocument,
} from "./MessageStats.types";

const RequestStatsSchemaField: Record<keyof IMessageStats, any> = {
  nullifier: String,
  epoch: String,
  xShare: String,
  yShare: String,
  rlnIdentifier: String,
};

const RequestStatsSchema = new Schema<
  IMessageStatsDocument,
  IMessageStatsModel
>(RequestStatsSchemaField);

RequestStatsSchema.statics.isDuplicate = isDuplicate;
RequestStatsSchema.statics.isSpam = isSpam;
RequestStatsSchema.statics.getSharesByEpochForUser = getSharesByEpochForUser;

export default RequestStatsSchema;
