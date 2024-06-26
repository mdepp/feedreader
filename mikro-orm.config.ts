import { Migrator } from "@mikro-orm/migrations";
import type { Options } from "@mikro-orm/postgresql";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Channel, HTTPCache, Item } from "~/models";
import getConnectionUrl from "~/utils/getConnectionUrl";

const config: Options = {
  driver: PostgreSqlDriver,
  clientUrl: getConnectionUrl(),
  entities: [HTTPCache, Channel, Item],
  migrations: { path: "./migrations" },
  extensions: [Migrator],
};

export default config;
