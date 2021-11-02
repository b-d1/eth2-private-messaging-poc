import { model } from "mongoose";
import UserSchema from "./User.schema";
import { IUserDocument, IUserModel } from "./User.types";

const MODEL_NAME = "User";

const User: IUserModel = model<IUserDocument, IUserModel>(
  MODEL_NAME,
  UserSchema,
  "user"
);

export default User;
