import { init } from "@chainsafe/bls";
import Messenger from "./messaging/Messenger";
import User from "./db/models/User/User.model";
import {IUser} from "./db/models/User/User.types";
import { genRLNcredentials } from "./rln/utils"
import { getRegistrationCredentials } from "./utils"
import config from "./config";
import {RegistrationCredentials, Witness} from "./utils/types"
import { listenForMembershipEvents, getWitness, registerToSmartContract } from "./membership";

import { initDb } from "./db";

class Client {

    messenger: Messenger | undefined;
    idCommitment: string | undefined;

    public setup = async () => {
        // Init the BLS library
        await init("herumi");

        // Init db
        await initDb();

        this.messenger = new Messenger();
        await this.messenger.setup();
        listenForMembershipEvents();
        await this.register();
    }

    private register = async () => {

        let user = await User.findOne({});
        if(!user) {
            const rlnCredentials = genRLNcredentials();
            console.log("idCommitment", rlnCredentials.idCommitment);
            const regCredentials: RegistrationCredentials = getRegistrationCredentials(rlnCredentials.idCommitment, config.BLS_PRIVATE_KEY, config.BLS_PUBLIC_KEY);
            const status = await registerToSmartContract(regCredentials);
            if(!status) {
                throw new Error("Invalid registration to the RegistryContract.")
            }
            const iUser: IUser = {
                rlnIdCommitment: rlnCredentials.idCommitment,
                rlnSecret: rlnCredentials.secret,
                blsPrivKey: config.BLS_PRIVATE_KEY,
                blsPubKey: config.BLS_PUBLIC_KEY
            };
            user = new User(iUser);

            await user.save();
        }
        this.idCommitment = user.rlnIdCommitment;
    }

    public sendMessage = async (content: string) => {
        if(!this.idCommitment || !this.messenger) {
            throw new Error("Client not initialized");
        }
        console.log("id commitment", this.idCommitment);
        const witness: Witness = await getWitness(this.idCommitment);
        console.log("witness", witness);
        await this.messenger?.sendMessage(content, witness);
    }

}

export default Client;
