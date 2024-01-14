import { QueryOrder, ReflectMetadataProvider } from "@mikro-orm/core";
import type { EntityManager } from "@mikro-orm/postgresql";
import { MikroORM } from "@mikro-orm/postgresql";
import type { Auth0Profile } from "remix-auth-auth0";
import invariant from "tiny-invariant";
import { Channel, HTTPCache, Item } from "~/models";
import getConnectionUrl from "~/utils/getConnectionUrl";
import { fetchRssWithCache, updateFromDocument } from "~/utils/scraper.server";

export class DBService {
  private ormPromise: Promise<MikroORM>;

  public constructor() {
    this.ormPromise = MikroORM.init({
      metadataProvider: ReflectMetadataProvider,
      entities: [HTTPCache, Channel, Item],
      clientUrl: getConnectionUrl(),
      type: "postgresql",
      debug: process.env.NODE_ENV === "development",
      migrations: { path: "./migrations" },
    });
  }

  private async transactional<T>(fn: (em: EntityManager) => Promise<T>) {
    const orm = await this.ormPromise;
    return orm.em.fork().transactional(fn);
  }

  async listChannels(user: Auth0Profile) {
    invariant(user.id !== undefined, "User id must be defined");
    return this.transactional((em) => em.find(Channel, { userId: user.id }));
  }

  async getChannel(user: Auth0Profile, id: number) {
    invariant(user.id !== undefined, "User id must be defined");
    return this.transactional((em) => em.findOne(Channel, { id, userId: user.id }));
  }

  async createChannel(user: Auth0Profile, url: string) {
    invariant(user.id !== undefined, "User id must be defined");
    const userId = user.id;
    return this.transactional(async (em) => {
      const existingChannel = await em.findOne(Channel, { url, userId });
      if (existingChannel !== null) {
        return null;
      }
      const document = await fetchRssWithCache(em, url);
      invariant(typeof document === "string", "Failed to fetch data");
      const { channel } = await updateFromDocument(em, { document, url, userId, initial: true });
      await em.commit();
      return channel;
    });
  }

  async deleteChannel(user: Auth0Profile, id: number) {
    this.transactional(async (em) => {
      const channel = await em.findOne(Channel, { id, userId: user.id });
      invariant(channel !== null, "Channel must exist");
      await em.nativeDelete(Item, { channel });
      em.remove(channel);
      await em.commit();
    });
  }

  async getFeed(user: Auth0Profile) {
    return this.transactional((em) =>
      em.find(
        Item,
        { channel: { userId: user.id } },
        { orderBy: [{ pubDate: QueryOrder.DESC_NULLS_LAST }, { index: QueryOrder.ASC }], limit: 20 },
      ),
    );
  }

  async sync() {
    return this.transactional(async (em) => {
      const channels = await em.find(Channel, {});
      await Promise.all(
        channels.map(async (channel) => {
          const document = await fetchRssWithCache(em, channel.url);
          invariant(typeof document === "string", "Failed to fetch data");
          await updateFromDocument(em, { document, url: channel.url, userId: channel.userId });
        }),
      );
      await em.commit();
    });
  }

  async generate() {
    const orm = await this.ormPromise;
    orm.getSchemaGenerator().createSchema();
  }
}

const database = new DBService();
export default database;
