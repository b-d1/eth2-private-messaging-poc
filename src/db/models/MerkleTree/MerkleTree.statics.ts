import { MerkleTreeNode, MerkleTreeZero } from "./MerkleTree.model";
import {
  IMerkleTreeNodeDocument,
  IMerkleTreeNodeKey,
  IMerkleTreeZeroDocument,
} from "./MerkleTree.types";

export async function findByLevelAndIndex(
  this: typeof MerkleTreeNode,
  key: IMerkleTreeNodeKey
): Promise<IMerkleTreeNodeDocument | null> {
  return this.findOne({ key }).populate("parent");
}

export async function getNumberOfNodes(
  this: typeof MerkleTreeNode,
  level: number
): Promise<number> {
  return this.countDocuments({ "key.level": level });
}

export async function findAllLeaves(
  this: typeof MerkleTreeNode
): Promise<IMerkleTreeNodeDocument[]> {
  return this.find({ "key.level": 0 });
}

export async function findRoot(
  this: typeof MerkleTreeNode
): Promise<IMerkleTreeNodeDocument | null> {
  return this.findOne({ "key.level": 31, "key.index": 0 });
}

export async function getTotalNumberOfLeaves(
  this: typeof MerkleTreeNode
): Promise<number> {
  return this.countDocuments({ "key.level": 0 });
}

export async function findZeroes(
  this: typeof MerkleTreeZero
): Promise<IMerkleTreeZeroDocument[] | null> {
  return this.find();
}

export async function findLeafByHash(
  this: typeof MerkleTreeNode,
  hash: string
): Promise<IMerkleTreeNodeDocument | null> {
  return this.findOne({ "key.level": 0, hash }).populate("parent");
}
