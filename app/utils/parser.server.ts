// Idea from https://stackoverflow.com/a/60855343

import { load } from "cheerio";
import { cheerioJsonMapper } from "cheerio-json-mapper";
import type { Channel, Item } from "~/models";

export function guessDocumentType(text: string) {
  if (text.toLowerCase().startsWith("<!doctype html>")) return "html";
  if (text.toLowerCase().startsWith("<html>")) return "html";
  return "xml";
}

export function parseHtml(document: string) {
  const $ = load(document);
  const feeds = $('head link[type="application/rss+xml"]')
    .map((_, el) => ({ href: $(el).attr("href"), title: $(el).attr("title") }))
    .get();
  return { feeds };
}

type ParsedChannel = Omit<Channel, "id" | "url" | "items" | "userId">;
type ParsedItem = Omit<Item, "channel" | "index">;

export async function parseRSS(document: string) {
  const $ = load(document, { xmlMode: true });

  const template = {
    channel: {
      $: "rss > channel",
      title: "> title",
      link: "> link",
      description: "> description",
      pubDate: "> pubDate | parseAs:date",
    },
    items: [
      {
        $: "rss > channel > item",
        guid: "> guid",
        title: "> title",
        link: "> link",
        description: "> description",
        author: "> author",
        category: "> category",
        comments: "> comments",
        enclosure: "> enclosure",
        pubDate: "> pubDate | parseAs:date",
      },
    ],
  };

  const data = (await cheerioJsonMapper($(":root"), template)) as {
    channel: Partial<ParsedChannel>;
    items: Partial<ParsedItem>[];
  };

  const parsedChannel = data.channel as ParsedChannel;
  const parsedItems = data.items.map((item) => {
    const guid = item.guid ?? syntheticGuid(item.title, item.description);
    if (guid === undefined) throw new Error("Item has no viable guid");
    return { ...item, guid } as ParsedItem;
  });
  return { parsedChannel, parsedItems };
}

function syntheticGuid(title?: string, description?: string) {
  if (title === undefined && description === undefined) return undefined;
  return `${title} ${description}`;
}
