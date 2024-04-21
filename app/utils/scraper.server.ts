import type { EntityManager } from "@mikro-orm/postgresql";
import { wrap } from "@mikro-orm/postgresql";
import invariant from "tiny-invariant";
import { Channel, HTTPCache, Item } from "~/models";
import { guessDocumentType, parseHtml, parseRSS } from "./parser.server";

function parseDate(text: string | null) {
  if (text === null) return text;
  return new Date(text);
}

export async function fetchRssWithCache(em: EntityManager, url: string, init?: RequestInit) {
  let document = await fetchWithCache(em, url);
  if (document === null) return document;
  if (guessDocumentType(document) === "html") {
    const { feeds } = parseHtml(document);
    invariant(feeds.length > 0, "Document has no feeds");
    // XXX For now just use the first feed
    invariant(typeof feeds[0].href === "string", "Feed must have href");
    const feedUrl = new URL(feeds[0].href, url).href;
    document = await fetchWithCache(em, feedUrl);
  }
  return document;
}

export async function fetchWithCache(em: EntityManager, url: string, init?: RequestInit) {
  const cacheRepository = em.getRepository(HTTPCache);
  const headers = new Headers(init?.headers);

  const cache = await cacheRepository.upsert({ url });
  if (cache.etag !== null) {
    headers.set("If-None-Match", cache.etag);
  }
  if (cache.last_modified !== null) {
    headers.set("If-Modified-Since", cache.last_modified.toUTCString());
  }

  const response = await fetch(url, { ...init, headers });

  if (response.status === 304 || response.status === 200) {
    cache.etag = response.headers.get("ETag");
    cache.last_modified = parseDate(response.headers.get("Last-Modified"));
  }
  if (response.status === 200) {
    cache.text = await response.text();
  }

  if (response.status === 200 || response.status === 304) {
    return cache.text;
  }
  throw response;
}

type UpdateFromDocumentParams = {
  document: string;
  url: string;
  userId: string;
  initial?: boolean;
};
export async function updateFromDocument(
  em: EntityManager,
  { document, url, userId, initial = false }: UpdateFromDocumentParams,
) {
  const { parsedChannel, parsedItems } = await parseRSS(document);

  console.log(url, userId);
  const channel = await em.upsert(new Channel(url, userId));
  console.log(document);
  console.log(parsedChannel);
  wrap(channel).assign(parsedChannel);

  const existingItems = await em.find(Item, { guid: parsedItems.map((item) => item.guid) });
  // XXX Can't properly control on conflict behavior so check existing items
  // beforehand.
  const existingItemGuids = existingItems.map((item) => item.guid);
  const items = await Promise.all(
    parsedItems.map(async (parsedItem, index) => {
      let pubDate = parsedItem.pubDate;
      if (!initial && !existingItemGuids.includes(parsedItem.guid)) {
        pubDate = new Date();
      }
      const item = await em.upsert(new Item(parsedItem.guid, channel, index));
      wrap(item).assign({ ...parsedItem, pubDate });
      return item;
    }),
  );
  return { channel, items };
}
