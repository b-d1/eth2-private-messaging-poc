import Client from "../src/Client";
import { InitUserType } from "../src/utils/types";

const basic = async () => {
  const client = new Client();

  await client.setup(InitUserType.EXISTING);
  await client.sendMessage("hello");
};

const multiClient = async () => {
  const client1 = new Client();
  await client1.setup(InitUserType.NEW);

  const client2 = new Client();
  await client2.setup(InitUserType.NEW);

  await client1.sendMessage("hello");
  await client2.sendMessage("hi");
};

const multiClientSpam = async () => {
  const client1 = new Client();
  await client1.setup(InitUserType.NEW);

  const client2 = new Client();
  await client2.setup(InitUserType.NEW);

  await client1.sendMessage("hello");

  await client2.sendMessage("hi");
  await client2.sendMessage("h11");

  // the client2 should be slashed ast this point
  await client2.sendMessage("hi3");

};

const multiClientDuplicate = async () => {
  const client1 = new Client();
  await client1.setup(InitUserType.NEW);

  const client2 = new Client();
  await client2.setup(InitUserType.NEW);

  await client1.sendMessage("hello");

  await client2.sendMessage("hi");
  await client2.sendMessage("hi");
};

const testType = process.argv[2] || "basic";

if (testType === "basic") {
  basic();
} else if (testType === "multiClient") {
  multiClient();
} else if (testType === "spam") {
  multiClientSpam();
} else if (testType === "duplicate") {
  multiClientDuplicate();
} else {
  console.error(
    `Invalid test type ${testType}. Please choose from: 'basic', 'multiClient', 'spam', 'duplicate'.`
  );
}
