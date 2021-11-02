import { Schema } from "mongoose";
import {
  findByLevelAndIndex,
  findZeroes,
  getNumberOfNodes,
  findAllLeaves,
  findRoot,
  getTotalNumberOfLeaves,
  findLeafByHash,
} from "./MerkleTree.statics";
import {
  IMerkleTreeNode,
  IMerkleTreeNodeDocument,
  IMerkleTreeNodeModel,
  IMerkleTreeZero,
  IMerkleTreeZeroModel,
  IMerkleTreeZeroDocument,
} from "./MerkleTree.types";

// Node
const MerkleTreeNodeSchemaFields: Record<keyof IMerkleTreeNode, any> = {
  key: {
    level: Number,
    index: Number,
  },
  parent: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "MerkleTreeNode",
  },
  siblingHash: String,
  banned: {
    type: Boolean,
    required: false,
  },
  hash: String,
};

export const MerkleTreeNodeSchema = new Schema<
  IMerkleTreeNodeDocument,
  IMerkleTreeNodeModel
>(MerkleTreeNodeSchemaFields);

MerkleTreeNodeSchema.statics.findByLevelAndIndex = findByLevelAndIndex;
MerkleTreeNodeSchema.statics.getNumberOfNodes = getNumberOfNodes;
MerkleTreeNodeSchema.statics.findAllLeaves = findAllLeaves;
MerkleTreeNodeSchema.statics.findLeafByHash = findLeafByHash;
MerkleTreeNodeSchema.statics.findRoot = findRoot;
MerkleTreeNodeSchema.statics.getTotalNumberOfLeaves = getTotalNumberOfLeaves;

// Zeroes
export const MerkleTreeZeroSchemaFields: Record<keyof IMerkleTreeZero, any> = {
  level: { type: Number, unique: true },
  hash: String,
};

export const MerkleTreeZeroSchema = new Schema<
  IMerkleTreeZeroDocument,
  IMerkleTreeZeroModel
>(MerkleTreeZeroSchemaFields);

MerkleTreeZeroSchema.statics.findZeroes = findZeroes;
