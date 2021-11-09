import { Schema } from "mongoose";
import { getTotalBannedUsers, isBanned } from "./BannedUser.statics";
import {
  IBannedUser,
  IBannedUserDocument,
  IBannedUserModel,
} from "./BannedUser.types";

const BannedUserSchemaFields: Record<keyof IBannedUser, any> = {
  idCommitment: { type: String, required: true, unique: true },
  secret: { type: String, required: true, unique: true },
};

const UserSchema = new Schema<IBannedUserDocument, IBannedUserModel>(
  BannedUserSchemaFields
);

UserSchema.statics.getTotalBannedUsers = getTotalBannedUsers;
UserSchema.statics.isBanned = isBanned;

export default UserSchema;
