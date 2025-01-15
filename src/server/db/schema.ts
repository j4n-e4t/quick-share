// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `quick-share_${name}`);

export const shares = createTable("share", {
  id: integer("id").primaryKey().unique().generatedByDefaultAsIdentity(),
  code: varchar("code").unique(),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  availableUntil: timestamp("available_until", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP + INTERVAL '1 hour'`)
    .notNull(),
});

export type Share = typeof shares.$inferSelect;
