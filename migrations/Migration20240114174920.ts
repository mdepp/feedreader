import { Migration } from '@mikro-orm/migrations';

export class Migration20240114174920 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "item" alter column "category" type varchar(4096) using ("category"::varchar(4096));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "item" alter column "category" type varchar(255) using ("category"::varchar(255));');
  }

}
