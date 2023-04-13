import { Migration } from '@mikro-orm/migrations';

export class Migration20230413031223 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `channel` (`id` integer not null primary key autoincrement, `url` text not null, `title` text null, `link` text null, `description` text null, `pub_date` datetime null, `user_id` text not null);');
    this.addSql('create index `url_userId` on `channel` (`url`, `user_id`);');
    this.addSql('create unique index `channel_url_user_id_unique` on `channel` (`url`, `user_id`);');

    this.addSql('create table `httpcache` (`url` text not null, `etag` text null, `last_modified` datetime null, `text` text null, primary key (`url`));');

    this.addSql('create table `item` (`guid` text not null, `title` text null, `link` text null, `description` text null, `author` text null, `category` text null, `comments` text null, `enclosure` text null, `pub_date` datetime null, `index` integer not null, `channel_id` integer not null, constraint `item_channel_id_foreign` foreign key(`channel_id`) references `channel`(`id`) on update cascade, primary key (`guid`));');
    this.addSql('create index `item_channel_id_index` on `item` (`channel_id`);');
  }

}
