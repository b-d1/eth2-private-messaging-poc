import * as path from "path";
import * as fs from "fs";
import config from "../config";
import { MerkleTree } from "../membership";
import {WakuMessage, RateLimitProof, WakuMessageStatus, RLNcredentials} from "../utils/types"
import { Rln, genSignalHash, genExternalNullifier, FullProof } from "@libsem/protocols"
import MessageStats from "../db/models/MessageStats/MessageStats.model";
import User from "../db/models/User/User.model";
import poseidonHash from "../utils/hasher";

const PROVER_KEY_PATH: string = path.join("./circuitFiles", "rln_final.zkey");
const CIRCUIT_PATH: string = path.join("./circuitFiles", "rln.wasm");
const VERIFIER_KEY_PATH: string = path.join("./circuitFiles/rln", "verification_key.json");

class RLN {

    verifierKey: any;
    membershipTree: MerkleTree
    constructor(
        membershipTree: MerkleTree
    ) {
        this.membershipTree = membershipTree;

        this.verifierKey = JSON.parse(fs.readFileSync(VERIFIER_KEY_PATH, "utf-8"));
    }

    public verifyProof = async (
        message: WakuMessage
    ): Promise<WakuMessageStatus> => {

        const proof: FullProof = {
            proof: message.rateLimitProof.proof,
            publicSignals: [
              BigInt(message.rateLimitProof.yShare),
              BigInt(message.rateLimitProof.merkleRoot),
              BigInt(message.rateLimitProof.nullifier),
              genSignalHash(message.rateLimitProof.xShare),
              message.rateLimitProof.epoch,
              BigInt(message.contentTopic)
            ],
          };
      
          const status = await Rln.verifyProof(this.verifierKey, proof);
      
          if (!status) {
            return WakuMessageStatus.INVALID;
          } 
          return WakuMessageStatus.VALID;

    }

    public generateProof = async (message: WakuMessage): Promise<RateLimitProof | undefined> => {
        
        const user = await User.findOne({});
        if(!user) return;

        // get witness
        const witness = await this.membershipTree.retrievePath(user.rlnIdCommitment);
        if(!witness) return;

        // TODO: set appropriateEpoch
        const epoch = genExternalNullifier("123");

        // TODO: calculate this more appropriatelly
        const signal = `${message.payload}${message.contentTopic}`;
        const signalHash = genSignalHash(signal);

        const rlnIdentifier = BigInt(message.contentTopic);
        const identitySecret = BigInt(user.rlnSecret); 

        const proofInput = {
            identity_secret: identitySecret,
            path_elements: witness.pathElements,
            identity_path_index: witness.indices,
            epoch,
            x: signalHash,
            rln_identifier: rlnIdentifier
        };

    const proofWitness: FullProof = Rln.genWitness(identitySecret, witness, epoch, signal, rlnIdentifier);

    const fullProof: FullProof = await Rln.genProof(proofWitness, CIRCUIT_PATH, PROVER_KEY_PATH);

    const [y, nullifier] = Rln.calculateOutput(
        identitySecret,
        BigInt(epoch),
        rlnIdentifier,
        signalHash
      );

      const proof: RateLimitProof = {
          proof: fullProof.proof,
          nullifier: nullifier.toString,
          xShare: signal,
          yShare: y.toString(),
          epoch,
          merkleRoot: witness.root
      }

      return proof;

    }

    public retreiveCredentials = async (proof: RateLimitProof): Promise<RLNcredentials> => {

        const requestStats = await MessageStats.getSharesByEpochForUser(
            proof.epoch,
            proof.nullifier
          );

          const sharesX = requestStats.map((stats) => BigInt(stats.xShare));
          const sharesY = requestStats.map((stats) => BigInt(stats.yShare));

          const secret: bigint = Rln.retrieveSecret(sharesX[0], genSignalHash(proof.xShare), sharesY[0], BigInt(proof.yShare));
          const idCommitment = poseidonHash([secret]).toString();
        
          return {
              secret: secret.toString(),
              idCommitment: idCommitment
          }
      


    }

}