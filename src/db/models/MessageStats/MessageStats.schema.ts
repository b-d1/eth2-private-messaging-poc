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

/**
 * The recipientIdCommitment field is the idCommitment of
 * the message reciever. It is only available at the recipient side, and is used for the multiple clients
 * on the same machine scenario. It serves as a domain separation for the message metadata being stored -
 * domain separation by user.
 */
const RequestStatsSchemaField: Record<keyof IMessageStats, any> = {
  nullifier: String,
  epoch: String,
  xShare: String,
  yShare: String,
  rlnIdentifier: String,
  recipientIdCommitment: String,
};

const RequestStatsSchema = new Schema<
  IMessageStatsDocument,
  IMessageStatsModel
>(RequestStatsSchemaField);

RequestStatsSchema.statics.isDuplicate = isDuplicate;
RequestStatsSchema.statics.isSpam = isSpam;
RequestStatsSchema.statics.getSharesByEpochForUser = getSharesByEpochForUser;

export default RequestStatsSchema;
