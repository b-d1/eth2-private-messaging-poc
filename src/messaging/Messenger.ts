import { getBootstrapNodes, Waku, WakuMessage } from "js-waku";
import {messageTypes, appContentTopic} from "../utils/messaging"
// const getBootstrapNodes = (): string[] => {

//     return [
//         "/dns4/node-01.ac-cn-hongkong-c.wakuv2.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAkvWiyFsgRhuJEb9JfjYxEkoHLgnUQmr1N5mKWnYjxYRVm",
//         "/dns4/node-01.do-ams3.wakuv2.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAmPLe7Mzm8TsYUubgCAW1aJoeFScxrLj8ppHFivPo97bUZ",
//       ];

// }

class Messenger {

    wakuNode: Waku | undefined;
    rln: RLN;
    constructor (rln: RLN) {
        this.rln = rln;
    }

    public async setup(): Promise<boolean> {
        this.wakuNode = await Waku.create({
            bootstrap: true
          });

        const nodes = await getBootstrapNodes();
        await Promise.all(nodes.map((addr) => (<Waku>this.wakuNode).dial(addr)));
        await this.wakuNode.waitForConnectedPeer();

        this.wakuNode.relay.addObserver(this.processIncomingMessages, [appContentTopic]);


        return true;
    }
    
    
    public async processIncomingMessages(wakuMessage: WakuMessage) {


    }
    

}