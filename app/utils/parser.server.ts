// Idea from https://stackoverflow.com/a/60855343

import {XmlDocument, XmlElement, XmlText} from '@rgrove/parse-xml';
import {Channel, Item} from '~/models';

function Optional<In, Out>(transform: (v: In) => Out) {
  function inner(value?: In): Out | undefined {
    if (value === undefined) return undefined;
    else return transform(value);
  }
  return inner;
}

function Required<In, Out>(transform: (v: In) => Out) {
  function inner(value?: In): Out {
    if (value === undefined) throw 'Transform is required';
    else return transform(value);
  }
  return inner;
}

type TransformSpec<T> = {
  [K in keyof T]: (v: any) => T[K];
};
function parseElement<T>(element: XmlElement, spec: TransformSpec<T>): T {
  const entries: any[] = Object.entries(spec).map(([key, transform]) => {
    const keyElement = element.children.find(
      (child): child is XmlElement => child instanceof XmlElement && child.name === key
    );
    console.log(keyElement);
    const valueElement = keyElement?.children.find((child): child is XmlText => child instanceof XmlText);
    return [key, (transform as TransformSpec<T>[keyof T])(valueElement?.text)];
  });
  return Object.fromEntries(entries) as T;
}

export async function parseDocument(document: XmlDocument) {
  const rssNode = document.children.find(
    (child): child is XmlElement => child instanceof XmlElement && child.name === 'rss'
  );
  const channelNode = rssNode?.children.find(
    (child): child is XmlElement => child instanceof XmlElement && child.name === 'channel'
  );
  const itemsNodes = channelNode?.children.filter(
    (child): child is XmlElement => child instanceof XmlElement && child.name === 'item'
  );

  if (channelNode === undefined || itemsNodes === undefined) throw new Error('Invalid RSS document');

  const parsedChannel = await parseChannel(channelNode);
  const parsedItems = await parseItems(itemsNodes);
  return {parsedChannel, parsedItems};
}

type ParsedChannel = Omit<Channel, 'id' | 'url' | 'items' | 'userId'>;
async function parseChannel(channelNode: XmlElement): Promise<ParsedChannel> {
  return parseElement(channelNode, {
    title: Optional(String),
    link: Optional(String),
    description: Optional(String),
    pubDate: Optional(v => new Date(v)),
  });
}

function syntheticGuid(title?: string, description?: string) {
  if (title === undefined && description === undefined) return undefined;
  return `${title} ${description}`;
}

type ParsedItem = Omit<Item, 'channel' | 'index'>;
async function parseItems(itemNodes: XmlElement[]): Promise<ParsedItem[]> {
  return itemNodes
    .map(itemNode => {
      return parseElement(itemNode, {
        guid: Optional(String),
        title: Optional(String),
        link: Optional(String),
        description: Optional(String),
        author: Optional(String),
        category: Optional(String),
        comments: Optional(String),
        enclosure: Optional(String),
        pubDate: Optional(v => new Date(v)),
      });
    })
    .map(parsedItem => {
      const guid = parsedItem.guid ?? syntheticGuid(parsedItem.title, parsedItem.description);
      if (guid === undefined) throw new Error('Item has no viable guid');
      return {...parsedItem, guid};
    });
}
