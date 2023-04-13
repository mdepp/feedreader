import type { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Channel, HTTPCache, Item } from "~/models";

const config: Options = {
  driver: PostgreSqlDriver,
  clientUrl: process.env.DATABASE_URL,
  entities: [HTTPCache, Channel, Item],
  migrations: { path: "./migrations" },
  dbName: "weathered_snow_5705",
};

export default config;
