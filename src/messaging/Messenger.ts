import { getBootstrapNodes, Waku, WakuMessage } from "js-waku";
import config from "../config";
import { Type } from "protobufjs";
import {getMessageTypes, MessageTypes, isSpam, registerValidMessage, isDuplicate} from "./utils"
import {WakuMessage as WakuMessageType, RateLimitProof, WakuMessageStatus, RLNcredentials, Witness} from "../utils/types"
import {generateProof, retreiveCredentials, verifyProof} from "../rln"
// const getBootstrapNodes = (): string[] => {

//     return [
//         "/dns4/node-01.ac-cn-hongkong-c.wakuv2.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAkvWiyFsgRhuJEb9JfjYxEkoHLgnUQmr1N5mKWnYjxYRVm",
//         "/dns4/node-01.do-ams3.wakuv2.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAmPLe7Mzm8TsYUubgCAW1aJoeFScxrLj8ppHFivPo97bUZ",
//       ];

// }

class Messenger {

    wakuNode: Waku | undefined;
    messageTypes: MessageTypes | undefined;

    public  setup = async (): Promise<boolean> => {
        this.wakuNode = await Waku.create({
            bootstrap: true
          });

        const nodes = await getBootstrapNodes();
        await Promise.all(nodes.map((addr) => (this.wakuNode as Waku).dial(addr)));
        await this.wakuNode.waitForConnectedPeer();

        this.wakuNode.relay.addObserver(this.processIncomingMessages, [config.APP_CONTENT_TOPIC]);

        this.messageTypes = await getMessageTypes();

        return true;
    }


    private processIncomingMessages = async (wakuMessage: WakuMessage) =>  {
        if (!wakuMessage.payload || !this.messageTypes) return;

        const message: WakuMessageType = this.messageTypes.WakuMessage.decode(wakuMessage.payload) as any;
        // const rlnProof: RateLimitProof = message.rateLimitProof;

        const status = await verifyProof(message);
        console.log("incoming message verified...", status);

        if(status === WakuMessageStatus.VALID) {
            
            console.log("message", message.payload.toString())
            const duplicate = await isDuplicate(message);
            
            if(!duplicate) {
            
                const spam = await isSpam(message);

                // TODO: 
                if(spam) {
                    // obtain users credentials
                    const userCredentials = await retreiveCredentials(<RateLimitProof>message.rateLimitProof)
                    // remove the user and propagate the message

                } else {
                    await registerValidMessage(message);
                }

            }

        }
        


    }

    public sendMessage = async (content: string, witness: Witness) => {
        if(!this.messageTypes || !this.wakuNode) {
            throw new Error("Improper initialization");
        }

        const message: WakuMessageType = {
            payload: Buffer.from(content, "utf-8"),
            contentTopic: config.APP_CONTENT_TOPIC,
            version: 1,
            timestamp:  Date.now()
        }
        const proof: RateLimitProof = await generateProof(message, witness);
        message.rateLimitProof = proof;

        const msgVerificationErr = (this.messageTypes as MessageTypes).WakuMessage.verify(message);
        if(msgVerificationErr) {
            throw new Error(msgVerificationErr);
        }

        const protoMessage = this.messageTypes.WakuMessage.create(message);
        const payload = this.messageTypes.WakuMessage.encode(protoMessage).finish();
        const wakuMessage = await WakuMessage.fromBytes(payload, config.APP_CONTENT_TOPIC);

        await this.wakuNode.lightPush.push(wakuMessage);

    }


}

export default Messenger