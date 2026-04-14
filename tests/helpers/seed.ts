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
 * LAB SCAFFOLD ONLY.
 *
 * The starter ships the data files and the low-level create/delete utilities.
 * Students implement the actual reset logic as part of the course work.
 */
export async function seedFreshDatabase(): Promise<SeedResult> {
	return notImplemented('seedFreshDatabase');
}

/**
 * LAB SCAFFOLD ONLY.
 *
 * The intended implementation should preserve user accounts/sessions while
 * resetting books and shelf entries back to the JSON fixtures above.
 */
export async function resetShelfContent(): Promise<SeedResult> {
	return notImplemented('resetShelfContent');
}
