import { Migration } from '@mikro-orm/migrations';

export class Migration20230413132348 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "item" alter column "description" type varchar(4096) using ("description"::varchar(4096));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "item" alter column "description" type varchar(255) using ("description"::varchar(255));');
  }

}
