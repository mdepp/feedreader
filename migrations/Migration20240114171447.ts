import { Migration } from '@mikro-orm/migrations';

export class Migration20240114171447 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "channel" alter column "title" type varchar(4096) using ("title"::varchar(4096));');
    this.addSql('alter table "item" alter column "title" type varchar(4096) using ("title"::varchar(4096));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "item" alter column "title" type varchar(255) using ("title"::varchar(255));');
    this.addSql('alter table "channel" alter column "title" type varchar using ("title"::varchar);');
  }

}
