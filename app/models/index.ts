import { Collection, Entity, Index, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";

@Entity()
export class HTTPCache {
  @PrimaryKey({ type: "string" })
  url!: string;
  @Property({ type: "string", nullable: true })
  etag?: string;
  @Property({ type: "datetime", nullable: true })
  last_modified?: Date;
  @Property({ type: "text", nullable: true })
  text?: string;

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
  @Property({ type: "string", nullable: true })
  title?: string;
  @Property({ type: "string", nullable: true })
  link?: string;
  @Property({ type: "string", nullable: true, length: 4096 })
  description?: string;
  @Property({ type: "datetime", nullable: true })
  pubDate?: Date;

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
  @Property({ type: "string", nullable: true })
  title?: string;
  @Property({ type: "string", nullable: true })
  link?: string;
  @Property({ type: "string", nullable: true, length: 4096 })
  description?: string;
  @Property({ type: "string", nullable: true })
  author?: string;
  @Property({ type: "string", nullable: true })
  category?: string;
  @Property({ type: "string", nullable: true })
  comments?: string;
  @Property({ type: "string", nullable: true })
  enclosure?: string;
  @Property({ type: "datetime", nullable: true })
  pubDate?: Date;
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
