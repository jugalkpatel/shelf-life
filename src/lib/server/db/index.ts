import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { getEnvironmentVariables } from '../environment';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const environment = getEnvironmentVariables(process.env);

const ensureDatabaseDirectory = (databaseUrl: string): void => {
	if (!databaseUrl.startsWith('file:')) return;
	const filePath = databaseUrl.slice('file:'.length);
	if (!filePath || filePath === ':memory:') return;
	mkdirSync(dirname(resolve(filePath)), { recursive: true });
};

ensureDatabaseDirectory(environment.databaseUrl);

const client = createClient({ url: environment.databaseUrl });

export const db = drizzle(client, { schema });

export type UserRecord = typeof schema.user.$inferSelect;
export type BookRecord = typeof schema.book.$inferSelect;
export type ShelfEntryRecord = typeof schema.shelfEntry.$inferSelect;
export type ShelfEntryStatus = (typeof schema.shelfEntryStatuses)[number];
export type UserSummary = Pick<UserRecord, 'id' | 'email'>;
export type BookSummary = Pick<BookRecord, 'id' | 'openLibraryId' | 'title'>;

export const { shelfEntryStatuses } = schema;
