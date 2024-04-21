import { Collection, Entity, Index, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from "@mikro-orm/postgresql";

@Entity()
export class HTTPCache {
  @PrimaryKey({ type: "string" })
  url!: string;
  @Property({ type: "string", nullable: true })
  etag: string | null = null;
  @Property({ type: "datetime", nullable: true })
  last_modified: Date | null = null;
  @Property({ type: "text", nullable: true })
  text: string | null = null;

  constructor(url: string) {
    this.url = url;
  }
}

@Entity()
@Index({ name: "url_userId", properties: ["url", "userId"] })
@Unique({ properties: ["url", "userId"] })
export class Channel {
  @PrimaryKey({ type: "number" })
  id!: number;
  @Property({ type: "string" })
  url!: string;
  @Property({ type: "string", nullable: true, length: 4096 })
  title: string | null = null;
  @Property({ type: "string", nullable: true })
  link: string | null = null;
  @Property({ type: "string", nullable: true, length: 4096 })
  description: string | null = null;
  @Property({ type: "datetime", nullable: true })
  pubDate: Date | null = null;

  @OneToMany(() => Item, (item) => item.channel)
  items = new Collection<Item>(this);

  @Property({ type: "string" })
  userId!: string;

  constructor(url: string, userId: string) {
    this.url = url;
    this.userId = userId;
  }
}

@Entity()
export class Item {
  @PrimaryKey({ type: "string" })
  guid!: string;
  @Property({ type: "string", nullable: true, length: 4096 })
  title: string | null = null;
  @Property({ type: "string", nullable: true })
  link: string | null = null;
  @Property({ type: "string", nullable: true, length: 4096 })
  description: string | null = null;
  @Property({ type: "string", nullable: true })
  author: string | null = null;
  @Property({ type: "string", nullable: true, length: 4096 })
  category: string | null = null;
  @Property({ type: "string", nullable: true })
  comments: string | null = null;
  @Property({ type: "string", nullable: true })
  enclosure: string | null = null;
  @Property({ type: "datetime", nullable: true })
  pubDate: Date | null = null;
  // Used to maintain sort order of items with no pubDate
  @Property({ type: "number" })
  index!: number;
  @ManyToOne(() => Channel)
  channel: Channel;

  constructor(guid: string, channel: Channel, index: number) {
    this.guid = guid;
    this.channel = channel;
    this.index = index;
  }
}
