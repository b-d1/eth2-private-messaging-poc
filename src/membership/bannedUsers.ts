import BannedUser from "../db/models/BannedUser/BannedUser.model";
import { updateLeaf } from "./merkleTree";
import { RLNcredentials } from "../utils/types";
import { isDuplicate } from "../messaging/utils";

/**
 * Tries to ban user if the user is not already banned.
 * The try part is not necessary for a single client on single machine scenario, but it is necessary for multiple
 * clients on a single machine scenario. One of the clients could have already banned a spammer, and that is why
 * we need to check if the spammer is already banned or not.
 */
export const tryBanningUser = async (rlnCredentials: RLNcredentials) => {

    // If the user is already banned, an exception will be thrown
    try {
    const bannedUser = new BannedUser({
        idCommitment: rlnCredentials.idCommitment,
        secret: rlnCredentials.secret,
    });
    await bannedUser.save();

    await updateLeaf(rlnCredentials.idCommitment);
    } catch(e: any) {
        console.log(e.message);
    }
};
