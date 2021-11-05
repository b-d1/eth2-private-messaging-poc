import { Model, Document } from "mongoose";

export interface IUser {
  rlnIdCommitment: string;
  rlnSecret: string;
  blsPubKey: string;
  blsPrivKey: string;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {}
