import { Model, Document } from "mongoose";
import {
  findByLevelAndIndex,
  findZeroes,
  getNumberOfNodes,
  findAllLeaves,
  findRoot,
  getTotalNumberOfLeaves,
  findLeafByHash,
} from "./MerkleTree.statics";

export interface IMerkleTreeNodeKey {
  level: number;
  index: number;
}

export interface IMerkleTreeNode {
  key: IMerkleTreeNodeKey;
  parent?: IMerkleTreeNode; // Root node has no parent.
  siblingHash?: string; // Root has no sibling.
  banned?: boolean; // Wether the user is banned or not, only present at level 0 nodes
  hash: string;
}

export interface IMerkleTreeNodeDocument extends IMerkleTreeNode, Document {}

export interface IMerkleTreeNodeModel extends Model<IMerkleTreeNodeDocument> {
  findByLevelAndIndex: typeof findByLevelAndIndex;
  getNumberOfNodes: typeof getNumberOfNodes;
  findAllLeaves: typeof findAllLeaves;
  findRoot: typeof findRoot;
  getTotalNumberOfLeaves: typeof getTotalNumberOfLeaves;
  findLeafByHash: typeof findLeafByHash;
}

export interface IMerkleTreeZero {
  level: number;
  hash: string;
}

export interface IMerkleTreeZeroDocument extends IMerkleTreeZero, Document {}

export interface IMerkleTreeZeroModel extends Model<IMerkleTreeZeroDocument> {
  findZeroes: typeof findZeroes;
}
