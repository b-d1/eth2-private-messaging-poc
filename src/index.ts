import { getBootstrapNodes, Waku, WakuMessage } from "js-waku";
import protons from "protons";

const appContentTopic = "/eth2-validators/1/chat/proto";
const proto = protons(`
message SimpleChatMessage {
  uint64 timestamp = 1;
  string text = 2;
}
`);

const testWakuMessaging = async () => {
  const wakuNode = await Waku.create({
    bootstrap: [
      "/dns4/node-01.ac-cn-hongkong-c.wakuv2.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAkvWiyFsgRhuJEb9JfjYxEkoHLgnUQmr1N5mKWnYjxYRVm",
      "/dns4/node-01.do-ams3.wakuv2.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAmPLe7Mzm8TsYUubgCAW1aJoeFScxrLj8ppHFivPo97bUZ",
    ],
  });

  const nodes = await getBootstrapNodes();
  await Promise.all(nodes.map((addr) => wakuNode.dial(addr)));
  await wakuNode.waitForConnectedPeer();

  const processIncomingMessage = (wakuMessage) => {
    // No need to attempt to decode a message if the payload is absent
    if (!wakuMessage.payload) return;

    const { timestamp, text } = proto.SimpleChatMessage.decode(
      wakuMessage.payload
    );

    console.log(`Message Received: ${text}, sent at ${timestamp.toString()}`);
  };

  wakuNode.relay.addObserver(processIncomingMessage, [appContentTopic]);

  const payload = proto.SimpleChatMessage.encode({
    timestamp: Date.now(),
    text: "Here is a message",
  });
  const message = await WakuMessage.fromBytes(payload, appContentTopic);

  const peers = wakuNode.relay.getPeers();

  console.log("Relay peers", peers);
  const result = await wakuNode.relay.send(message);
};

testWakuMessaging();
