import { SqliteDriver } from "@mikro-orm/sqlite";
import { Channel, HTTPCache, Item } from "~/models";

module.exports = {
  driver: SqliteDriver,
  dbName: "database.db",
  entities: [HTTPCache, Channel, Item],
};
