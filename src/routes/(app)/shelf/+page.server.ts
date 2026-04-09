import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { book, shelfEntry } from '$lib/server/db/schema';
import { getReadingGoalProgress } from '$lib/server/reading-goals';
import { calculateShelfSummary } from '$lib/shelf';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		// The (app) layout guard will already have redirected, but keep a
		// defensive check so this loader can be called from tests in isolation.
		return {
			user: locals.user,
			summary: calculateShelfSummary([]),
			entries: [],
			readingGoal: {
				year: new Date().getUTCFullYear(),
				targetBooks: null,
				finishedBooks: 0,
				percentage: 0,
				goalMet: false
			}
		};
	}

	const currentYear = new Date().getUTCFullYear();
	const [rows, readingGoal] = await Promise.all([
		db
			.select({ entry: shelfEntry, book })
			.from(shelfEntry)
			.innerJoin(book, eq(shelfEntry.bookId, book.id))
			.where(eq(shelfEntry.userId, locals.user.id))
			.orderBy(desc(shelfEntry.updatedAt)),
		getReadingGoalProgress(locals.user.id, currentYear)
	]);

	const entries = rows.map(({ entry, book: matchingBook }) => ({
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
		user: locals.user,
		summary: calculateShelfSummary(entries),
		entries,
		readingGoal
	};
};
