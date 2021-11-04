import Messenger from "./messaging/Messenger";
import User from "./db/models/User/User.model";
import {IUser} from "./db/models/User/User.types";
import { genRLNcredentials } from "./rln/utils"
import config from "./config";
import {Witness} from "./utils/types"
import { listenForMembershipEvents, getWitness, appendLeaf } from "./membership";

class Client {

    messenger: Messenger | undefined;
    idCommitment: string | undefined;

    public setup = async () => {

        this.messenger = new Messenger();
        await this.messenger.setup();
        this.register();
        listenForMembershipEvents();
    }

    private register = async () => {

        let user = await User.findOne({});
        if(!user) {
            const rlnCredentials = genRLNcredentials();
            const iUser: IUser = {
                rlnIdCommitment: rlnCredentials.idCommitment,
                rlnSecret: rlnCredentials.secret,
                leafIndex: -1,
                blsPrivKey: config.BLS_PRIVATE_KEY,
                blsPubKey: config.BLS_PUBLIC_KEY
            };
            user = new User(iUser);
            await appendLeaf(rlnCredentials.idCommitment);
            await user.save();
        }
        this.idCommitment = user.rlnIdCommitment;
    }

    public sendMessage = async (content: string) => {
        if(!this.idCommitment || !this.messenger) {
            throw new Error("Client not initialized");
        }
        const witness: Witness = await getWitness(this.idCommitment);
        await this.messenger?.sendMessage(content, witness);
    }

}

export default Client;
