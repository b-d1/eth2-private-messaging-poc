import Client from "../src/Client";

const basic = async () => {
  const client = new Client();

  await client.setup();
  await client.register();
  await client.sendMessage("hello");
};

const multiClient = async () => {
  const client1 = new Client();
  await client1.setup();
  await client1.registerNew();

  const client2 = new Client();
  await client2.setup();
  await client2.registerNew();

  await client1.sendMessage("hello");
  await client2.sendMessage("hi");

}

const multiClientSpam = async () => {

  const client1 = new Client();
  await client1.setup();
  await client1.registerNew();

  const client2 = new Client();
  await client2.setup();
  await client2.registerNew();

  await client1.sendMessage("hello");

  await client2.sendMessage("hi");
  await client2.sendMessage("h11");
}

const multiClientDuplicate = async () => {

  const client1 = new Client();
  await client1.setup();
  await client1.registerNew();

  const client2 = new Client();
  await client2.setup();
  await client2.registerNew();

  await client1.sendMessage("hello");

  await client2.sendMessage("hi");
  await client2.sendMessage("h1");
}

const testType = process.argv[2] || 'basic'

if(testType === 'basic') {
  basic();
} else if(testType === 'multiClient') {
  multiClient();
} else if (testType === 'spam') {
  multiClientSpam();
} else if (testType === 'duplicate') {
  multiClientDuplicate();
} else {
  console.error(`Invalid test type ${testType}. Please choose from: 'basic', 'multiClient', 'spam', 'duplicate'.`);
}
