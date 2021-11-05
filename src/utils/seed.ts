import config from "../config"
import {
  MerkleTreeZero,
  MerkleTreeNode,
} from "../db/models/MerkleTree/MerkleTree.model";
import poseidonHash from "./hasher";


const seed = async () => {
  await seedZeros(config.ZERO_VALUE);
};


const seedZeros = async (zeroValue: BigInt) => {
  const zeroHashes = await MerkleTreeZero.findZeroes();

  if (!zeroHashes || zeroHashes.length === 0) {
    for (let level = 0; level < config.MERKLE_TREE_LEVELS; level++) {
      zeroValue =
        level === 0 ? zeroValue : poseidonHash([zeroValue, zeroValue]);

      const zeroHashDocument = await MerkleTreeZero.create({
        level,
        hash: zeroValue.toString(),
      });

      await zeroHashDocument.save();
    }
  }
};

export { seed };
