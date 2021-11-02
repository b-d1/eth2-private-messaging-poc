import { model } from "mongoose";
import MessageStatsSchema from "./MessageStats.schema";
import {
  IMessageStatsDocument,
  IMessageStatsModel,
} from "./MessageStats.types";

const MODEL_NAME = "MessageStats";

const MessageStats: IMessageStatsModel = model<
  IMessageStatsDocument,
  IMessageStatsModel
>(MODEL_NAME, MessageStatsSchema, "messageStats");

export default MessageStats;
