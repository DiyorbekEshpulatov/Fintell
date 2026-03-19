
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});

export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: text('name'),
  ownerId: serial('owner_id').references(() => users.id),
});
