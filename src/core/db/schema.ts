import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export { users } from 'src/features/users/entities/users.schema';

export const discordGuilds = sqliteTable('discord_guilds', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guildId: text('guild_id').notNull().unique(),
  name: text('name'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at'),
});

export const commandLogs = sqliteTable('command_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guildId: text('guild_id'),
  userId: text('user_id').notNull(),
  commandName: text('command_name').notNull(),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});
