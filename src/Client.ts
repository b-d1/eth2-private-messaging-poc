import { init } from "@chainsafe/bls";
import Messenger from "./messaging/Messenger";
import User from "./db/models/User/User.model";
import { IUser } from "./db/models/User/User.types";
import { genRLNcredentials } from "./rln/utils";
import { getRegistrationCredentials } from "./utils/credentials";
import config from "./config";
import { RegistrationCredentials, Witness, InitUserType } from "./utils/types";
import {
  listenForMembershipEvents,
  getWitness,
  registerToSmartContract,
} from "./membership";
import { sleep } from "./utils/utils";

import { initDb } from "./db";
import { genBlsKeys } from "./utils/bls";

class Client {
  messenger: Messenger | undefined;
  idCommitment: string | undefined;
  rlnSecret: string | undefined;

  public setup = async (initType: InitUserType) => {
    // Init the BLS library
    await init("herumi");

    // Init db
    await initDb();

    listenForMembershipEvents();

    this.messenger = new Messenger();
    if (initType === InitUserType.NEW) {
      await this.initNewUser();
    } else {
      await this.initUser();
    }
    if (!this.idCommitment) throw new Error("User not initialized correctly");
    await this.messenger.setup(this.idCommitment);
  };

  private initNewUser = async () => {
    const rlnCredentials = genRLNcredentials();
    const blsKeys = await genBlsKeys();
    const regCredentials: RegistrationCredentials = getRegistrationCredentials(
      rlnCredentials.idCommitment,
      blsKeys.privkey,
      blsKeys.pubkey
    );

    const status = await registerToSmartContract(regCredentials);
    if (!status) {
      throw new Error("Invalid registration to the RegistryContract.");
    }
    const iUser: IUser = {
      rlnIdCommitment: rlnCredentials.idCommitment,
      rlnSecret: rlnCredentials.secret,
      blsPrivKey: blsKeys.privkey,
      blsPubKey: blsKeys.pubkey,
    };
    const user = new User(iUser);

    await user.save();
    // sleep 30 seconds to allow for merkle tree update from the smart contract
    console.log("Registration request to the smart contract, sleeping  for 30 sec...");
    await sleep(30);
    this.idCommitment = user.rlnIdCommitment;
    this.rlnSecret = user.rlnSecret;
  };

  private initUser = async () => {
    let user = await User.findOne({});
    if (!user) {
      const rlnCredentials = genRLNcredentials();
      const regCredentials: RegistrationCredentials =
        getRegistrationCredentials(
          rlnCredentials.idCommitment,
          config.BLS_PRIVATE_KEY,
          config.BLS_PUBLIC_KEY
        );
      const status = await registerToSmartContract(regCredentials);
      if (!status) {
        throw new Error("Invalid registration to the RegistryContract.");
      }
      const iUser: IUser = {
        rlnIdCommitment: rlnCredentials.idCommitment,
        rlnSecret: rlnCredentials.secret,
        blsPrivKey: config.BLS_PRIVATE_KEY,
        blsPubKey: config.BLS_PUBLIC_KEY,
      };
      user = new User(iUser);

      await user.save();

      // sleep 30 seconds to allow for merkle tree update from the smart contract
      console.log("Registration request to the smart contract, sleeping  for 30 sec...");
      await sleep(30);
    }
    this.idCommitment = user.rlnIdCommitment;
    this.rlnSecret = user.rlnSecret;
  };

  public sendMessage = async (content: string) => {
    console.log(`Sending message, idCommitment: ${this.idCommitment}...`);
    if (!this.idCommitment || !this.rlnSecret || !this.messenger) {
      throw new Error("Client not initialized");
    }
    const witness: Witness = await getWitness(this.idCommitment);
    await this.messenger?.sendMessage(content, witness, this.rlnSecret);
  };
}

export default Client;
