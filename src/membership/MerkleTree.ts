import config from "../config";
import {
  MerkleTreeNode,
  MerkleTreeZero,
} from "../db/models/MerkleTree/MerkleTree.model";
import { IMerkleTreeNodeDocument } from "../db/models/MerkleTree/MerkleTree.types";
import poseidonHash from "../utils/hasher";

  export const syncTree = async (idCommitments: string[]): Promise<boolean> => {
    return await addLeaves(idCommitments);
  };

  export const addLeaves = async (ids: string[]) => {
    for (const id of ids) {
      await appendLeaf(id, true);
    }

    return true;
  };

  export const appendLeaf = async (
    idCommitment: string,
    isUpdate: boolean = false
  ): Promise<string> => {
    if (!isUpdate || idCommitment !== BigInt(0).toString()) {
      if (await MerkleTreeNode.findLeafByHash(idCommitment)) {
        throw new Error(
          `The identity commitment ${idCommitment} already exist`
        );
      }
    }

    // Get the zero hashes.
    const zeroes = await MerkleTreeZero.findZeroes();

    if (!zeroes || zeroes.length === 0) {
      throw new Error(`The zero hashes have not yet been created`);
    }

    // Get next available index at level 0.
    let currentIndex = await MerkleTreeNode.getNumberOfNodes(0);

    if (currentIndex >= 2 ** config.MERKLE_TREE_LEVELS) {
      throw new Error(`The tree is full`);
    }

    let node: any = await MerkleTreeNode.create({
      key: { level: 0, index: currentIndex },
      hash: idCommitment,
    });

    for (let level = 0; level < config.MERKLE_TREE_LEVELS; level++) {
      if (currentIndex % 2 === 0) {
        node.siblingHash = zeroes[level].hash;

        let parentNode = await MerkleTreeNode.findByLevelAndIndex({
          level: level + 1,
          index: Math.floor(currentIndex / 2),
        });

        if (parentNode) {
          parentNode.hash = poseidonHash([
            BigInt(node.hash),
            BigInt(node.siblingHash),
          ]).toString();

          await parentNode.save();
        } else {
          parentNode = await MerkleTreeNode.create({
            key: {
              level: level + 1,
              index: Math.floor(currentIndex / 2),
            },
            hash: poseidonHash([BigInt(node.hash), BigInt(node.siblingHash)]),
          });
        }

        node.parent = parentNode;

        await node.save();

        node = parentNode;
      } else {
        const siblingNode = (await MerkleTreeNode.findByLevelAndIndex({
          level,
          index: currentIndex - 1,
        })) as IMerkleTreeNodeDocument;

        node.siblingHash = siblingNode.hash;
        siblingNode.siblingHash = node.hash;

        const parentNode = (await MerkleTreeNode.findByLevelAndIndex({
          level: level + 1,
          index: Math.floor(currentIndex / 2),
        })) as IMerkleTreeNodeDocument;

        parentNode.hash = poseidonHash([
          BigInt(siblingNode.hash),
          BigInt(node.hash),
        ]).toString();

        node.parent = parentNode;

        await node.save();
        await parentNode.save();
        await siblingNode.save();

        node = parentNode;
      }

      currentIndex = Math.floor(currentIndex / 2);
    }

    return node.hash;
  };

  export const updateLeaf = async (
    leafHash: string,
    newValue: string = config.ZERO_VALUE.toString()
  ) => {
    let node = await MerkleTreeNode.findLeafByHash(leafHash);

    if (!node) {
      throw new Error(
        `The user with identity commitment ${leafHash} doesn't exists`
      );
    }

    node.hash = newValue;
    await node.save();

    while (node && node.parent) {
      const nodeIndex = node.key.index;
      const siblingHash = BigInt(node.siblingHash as string);
      const nodeHash = BigInt(node.hash);

      const parent = await MerkleTreeNode.findByLevelAndIndex({
        level: node.key.level + 1,
        index: Math.floor(nodeIndex / 2),
      });

      const childrenHashes =
        nodeIndex % 2 === 0 ? [nodeHash, siblingHash] : [siblingHash, nodeHash];
      parent.hash = poseidonHash(childrenHashes).toString();

      await parent.save();
      node = parent;
    }
  };

  export const getWitness = async (idCommitment: string): Promise<any> => {
    // Get path starting from leaf node.
    const leafNode = await MerkleTreeNode.findLeafByHash(idCommitment);

    if (!leafNode) {
      throw new Error(`The identity commitment does not exist`);
    }

    const { key } = leafNode;

    // Get path and return array.
    const pathQuery = MerkleTreeNode.aggregate([
      {
        $match: {
          key,
        },
      },
      {
        $graphLookup: {
          from: "treeNodes",
          startWith: "$_id",
          connectFromField: "parent",
          connectToField: "_id",
          as: "path",
          depthField: "level",
        },
      },
      {
        $unwind: {
          path: "$path",
        },
      },
      {
        $project: {
          path: 1,
          _id: 0,
        },
      },
      {
        $addFields: {
          hash: "$path.hash",
          sibling: "$path.siblingHash",
          index: { $mod: ["$path.key.index", 2] },
          level: "$path.level",
        },
      },
      {
        $sort: {
          level: 1,
        },
      },
      {
        $project: {
          path: 0,
        },
      },
    ]);

    return new Promise((resolve, reject) => {
      pathQuery.exec((error, path) => {
        if (error) {
          reject(error);
        }

        const root = path.pop().hash;
        const pathElements = path.map((n) => n.sibling);
        const indices = path.map((n) => n.index);

        resolve({ pathElements, indices, root });
      });
    });
  };

