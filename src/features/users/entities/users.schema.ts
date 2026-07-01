import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    gameName: text('game_name').notNull(),
    characterName: text('character_name').notNull(),
    ocid: text('ocid').notNull(),
    createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at'),
    lastFetchedAt: integer('last_fetched_at').notNull().default(sql`(unixepoch())`),
  },
  (table) => [
    uniqueIndex('users_game_name_character_name_unique').on(table.gameName, table.characterName),
    uniqueIndex('users_game_name_ocid_unique').on(table.gameName, table.ocid),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
