import { Migration } from '@mikro-orm/migrations';

export class Migration20230413124647 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "channel" ("id" serial primary key, "url" varchar(255) not null, "title" varchar(255) null, "link" varchar(255) null, "description" varchar(255) null, "pub_date" timestamptz(0) null, "user_id" varchar(255) not null);');
    this.addSql('create index "url_userId" on "channel" ("url", "user_id");');
    this.addSql('alter table "channel" add constraint "channel_url_user_id_unique" unique ("url", "user_id");');

    this.addSql('create table "httpcache" ("url" varchar(255) not null, "etag" varchar(255) null, "last_modified" timestamptz(0) null, "text" text null, constraint "httpcache_pkey" primary key ("url"));');

    this.addSql('create table "item" ("guid" varchar(255) not null, "title" varchar(255) null, "link" varchar(255) null, "description" varchar(255) null, "author" varchar(255) null, "category" varchar(255) null, "comments" varchar(255) null, "enclosure" varchar(255) null, "pub_date" timestamptz(0) null, "index" int not null, "channel_id" int not null, constraint "item_pkey" primary key ("guid"));');

    this.addSql('alter table "item" add constraint "item_channel_id_foreign" foreign key ("channel_id") references "channel" ("id") on update cascade;');
  }

}
