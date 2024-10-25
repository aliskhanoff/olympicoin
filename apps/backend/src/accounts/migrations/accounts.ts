import { sql, type Kysely } from 'kysely';
import type { AccountsTable, Database } from '../types';


export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('accounts').ifExists().execute();
  await db.schema.dropTable('accounts_ban').ifExists().execute();
  await db.schema.dropTable('accounts_ban_reasons').ifExists().execute();

  await db.schema
    .createTable('accounts')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('provider', 'varchar(64)')
    .addColumn('invited_by', 'integer', (col) => col.defaultTo(sql`NULL`))
    .addColumn('gender', 'varchar(32)', (col) => col.defaultTo('not_set'))
    .addColumn('user_id', 'varchar(64)', (col) => col.notNull().unique())
    .addColumn('username', 'varchar(128)', (col) => col.notNull().unique())
    .addColumn('first_name', 'varchar(64)', (col) => col.notNull())
    .addColumn('last_name', 'varchar(64)', (col) => col.notNull())
    .addColumn('invite_code', 'varchar(32)', (col) => col.notNull().unique())
    .addColumn('lang_id', 'integer', (col) => col.notNull().defaultTo(1))
    .addColumn('email', 'varchar(128)', (col) => col.unique())
    .addColumn('phone_number', 'varchar(128)', (col) => col.unique())
    .addColumn('is_deleted', 'boolean', (col) =>
      col.notNull().defaultTo(sql`false`),
    )
    .addColumn('is_disabled', 'boolean', (col) =>
      col.notNull().defaultTo(sql`false`),
    )
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await db.schema
    .createTable('accounts_ban_reasons')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(128)')
    .addColumn('description', 'varchar(1024)')
    .execute();

  await db.schema
    .createTable('accounts_ban')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('account_id', 'integer', (col) =>
      col.references('accounts.id').onDelete('no action'),
    )
    .addColumn('reason_id', 'integer', (col) =>
      col.references('accounts_ban_reasons.id').onDelete('no action'),
    )
    .addColumn('ban_type', 'varchar(32)', (col) => col.defaultTo('temporary'))
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('release_at', 'timestamp')
    .execute();


await db.schema
    .createTable('languages')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('language_code', 'varchar(8)')
      .addColumn('language_name', 'varchar(128)', (col) => col.notNull())
      .addColumn('is_enabled', 'boolean', (col) => col.defaultTo(sql`TRUE`))
    .execute()

    await db.insertInto("languages").values({
      language_code: "en",
      language_name: "English"
    }).execute()

}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('accounts_ban').ifExists().execute();
  await db.schema.dropTable('accounts_ban_reasons').ifExists().execute();
  await db.schema.dropTable('languages').ifExists().execute();
  await db.schema.dropTable('accounts').ifExists().execute();
}
