import { Schema } from "mongoose";
import { IUser, IUserDocument, IUserModel } from "./User.types";

const UserSchemaFields: Record<keyof IUser, any> = {
  rlnIdCommitment: { type: String, required: true, unique: true },
  leafIndex: { type: Number, required: true, unique: false },
  rlnSecret: { type: String, required: true, unique: true },
  blsPrivKey: { type: String, required: true, unique: true },
  blsPubKey: { type: String, required: true, unique: true },
};

const UserSchema = new Schema<IUserDocument, IUserModel>(UserSchemaFields);

export default UserSchema;
