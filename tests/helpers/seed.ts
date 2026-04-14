import bookSeedData from '../data/books.json';
import shelfEntrySeedData from '../data/shelf-entries.json';
import userSeedData from '../data/users.json';
import type { BookSummary, UserSummary } from '../../src/lib/server/db';

export type SeedResult = {
	reader: UserSummary;
	admin: UserSummary;
	books: BookSummary[];
};

const [reader, admin] = userSeedData;

if (!reader || !admin) {
	throw new Error('Expected tests/data/users.json to include the reader and admin users');
}

export const seeded = {
	users: userSeedData,
	books: bookSeedData,
	shelfEntries: shelfEntrySeedData,
	reader,
	admin
} as const;

const notImplemented = (functionName: string): never => {
	throw new Error(
		`${functionName} is part of the deterministic seeding lab. Build it in tests/helpers/seed.ts using tests/data/*.json plus the create/delete helpers in src/lib/server.`
	);
};

/**
 * Rebuilds the test database from `tests/data/*.json`.
 *
 * The intended implementation should:
 * - remove existing users, books, and shelf entries
 * - recreate the reader and admin users from `users.json`
 * - recreate the books from `books.json`
 * - recreate the shelf entries from `shelf-entries.json`
 * - return the created reader/admin user summaries plus the created books
 */
export async function seedFreshDatabase(): Promise<SeedResult> {
	return notImplemented('seedFreshDatabase');
}

/**
 * Resets shelf state without destroying existing user accounts or sessions.
 *
 * The intended implementation should:
 * - leave the existing reader/admin users in place
 * - delete and recreate books from `books.json`
 * - delete and recreate shelf entries from `shelf-entries.json`
 * - return the existing reader/admin user summaries plus the recreated books
 */
export async function resetShelfContent(): Promise<SeedResult> {
	return notImplemented('resetShelfContent');
}
