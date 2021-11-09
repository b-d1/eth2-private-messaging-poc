import { connect } from "mongoose";

import config from "../config";
import { seed } from "../utils/seed";

export const initDb = async () => {
  await connect(config.DB_CONNECTION_STRING);
  await seed();
};
