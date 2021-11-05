import Client from "../src/Client";

import {genBlsKeys} from "../src/utils/bls"

const main = async () => {

    const client = new Client();

    await client.setup();
    await client.sendMessage("hello");


};


main();