import { and, desc, eq, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { book, shelfEntry, user } from '$lib/server/db/schema';
import { toPublicShelfHandle } from '$lib/public-shelf';
import { calculateShelfSummary } from '$lib/shelf';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const requestedHandle = params.username.toLowerCase();

	// Find the first user whose email-derived handle matches the requested one.
	// SQLite doesn't ship a `split_part`, so we compare the prefix via lower-case
	// + `instr` trimming.
	const rows = await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email
		})
		.from(user)
		.where(sql`lower(substr(${user.email}, 1, instr(${user.email}, '@') - 1)) = ${requestedHandle}`)
		.limit(1);

	const owner = rows[0];
	if (!owner) {
		error(404, 'Reader not found');
	}

	const entryRows = await db
		.select({ entry: shelfEntry, book })
		.from(shelfEntry)
		.innerJoin(book, eq(shelfEntry.bookId, book.id))
		.where(and(eq(shelfEntry.userId, owner.id)))
		.orderBy(desc(shelfEntry.updatedAt));

	const entries = entryRows.map(({ entry, book: matchingBook }) => ({
		id: entry.id,
		status: entry.status,
		rating: entry.rating,
		book: {
			id: matchingBook.id,
			openLibraryId: matchingBook.openLibraryId,
			title: matchingBook.title,
			author: matchingBook.author,
			description: matchingBook.description
		}
	}));

	return {
		owner: {
			name: owner.name,
			handle: toPublicShelfHandle(owner.email)
		},
		summary: calculateShelfSummary(entries),
		entries
	};
};
