import { Migration } from '@mikro-orm/migrations';

export class Migration20230413131546 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "channel" alter column "description" type varchar(4096) using ("description"::varchar(4096));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "channel" alter column "description" type varchar using ("description"::varchar);');
  }

}
