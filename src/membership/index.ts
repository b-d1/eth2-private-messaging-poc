import { appendLeaf, updateLeaf, syncTree, getWitness } from "./merkleTree";
import {
  listenForMembershipEvents,
  register as registerToSmartContract,
} from "./smartContractRegistry";

import { tryBanningUser } from "./bannedUsers";

export {
  appendLeaf,
  updateLeaf,
  syncTree,
  getWitness,
  listenForMembershipEvents,
  registerToSmartContract,
  tryBanningUser,
};
