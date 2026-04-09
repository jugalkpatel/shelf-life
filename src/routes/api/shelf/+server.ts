import { and, desc, eq } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { book, shelfEntry } from '$lib/server/db/schema';
import { shelfStatuses, type ShelfStatus } from '$lib/shelf';
import type { RequestHandler } from './$types';

type CreateShelfEntryBody = {
	openLibraryId?: string;
	title?: string;
	author?: string;
	description?: string;
	status?: ShelfStatus;
};

const isShelfStatus = (value: unknown): value is ShelfStatus => {
	return typeof value === 'string' && (shelfStatuses as readonly string[]).includes(value);
};

const serializeEntry = (
	entry: typeof shelfEntry.$inferSelect,
	matchingBook: typeof book.$inferSelect
) => ({
	id: entry.id,
	status: entry.status,
	rating: entry.rating,
	createdAt: entry.createdAt.toISOString(),
	updatedAt: entry.updatedAt.toISOString(),
	book: {
		id: matchingBook.id,
		openLibraryId: matchingBook.openLibraryId,
		title: matchingBook.title,
		author: matchingBook.author,
		description: matchingBook.description
	}
});

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		error(401, 'Authentication required');
	}

	const rows = await db
		.select({ entry: shelfEntry, book })
		.from(shelfEntry)
		.innerJoin(book, eq(shelfEntry.bookId, book.id))
		.where(eq(shelfEntry.userId, locals.user.id))
		.orderBy(desc(shelfEntry.updatedAt));

	return json({
		entries: rows.map(({ entry, book: matchingBook }) => serializeEntry(entry, matchingBook))
	});
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		error(401, 'Authentication required');
	}

	let body: CreateShelfEntryBody;
	try {
		body = (await request.json()) as CreateShelfEntryBody;
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const openLibraryId = body.openLibraryId?.trim();
	if (!openLibraryId) {
		return json({ error: 'openLibraryId is required' }, { status: 400 });
	}

	const status: ShelfStatus = isShelfStatus(body.status) ? body.status : 'to-read';

	const [existingBook] = await db
		.select()
		.from(book)
		.where(eq(book.openLibraryId, openLibraryId))
		.limit(1);

	let resolvedBook = existingBook;
	if (!resolvedBook) {
		if (!body.title?.trim() || !body.author?.trim()) {
			return json(
				{ error: 'title and author are required when adding a new book' },
				{ status: 400 }
			);
		}
		const [inserted] = await db
			.insert(book)
			.values({
				openLibraryId,
				title: body.title.trim(),
				author: body.author.trim(),
				description: body.description?.trim() ?? null
			})
			.returning();
		resolvedBook = inserted;
	}

	const [existingEntry] = await db
		.select()
		.from(shelfEntry)
		.where(and(eq(shelfEntry.userId, locals.user.id), eq(shelfEntry.bookId, resolvedBook.id)))
		.limit(1);

	if (existingEntry) {
		return json(serializeEntry(existingEntry, resolvedBook), { status: 200 });
	}

	const [inserted] = await db
		.insert(shelfEntry)
		.values({
			userId: locals.user.id,
			bookId: resolvedBook.id,
			status,
			rating: null
		})
		.returning();

	return json(serializeEntry(inserted, resolvedBook), { status: 201 });
};
