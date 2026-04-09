import { and, eq } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { book, shelfEntry } from '$lib/server/db/schema';
import { shelfStatuses, type ShelfStatus } from '$lib/shelf';
import type { RequestHandler } from './$types';

type PatchBody = {
	status?: ShelfStatus;
	rating?: number | null;
};

const isShelfStatus = (value: unknown): value is ShelfStatus => {
	return typeof value === 'string' && (shelfStatuses as readonly string[]).includes(value);
};

const isValidRating = (value: unknown): value is number | null => {
	if (value === null) return true;
	return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5;
};

const loadEntryForUser = async (entryId: string, userId: string) => {
	const [row] = await db
		.select({ entry: shelfEntry, book })
		.from(shelfEntry)
		.innerJoin(book, eq(shelfEntry.bookId, book.id))
		.where(and(eq(shelfEntry.id, entryId), eq(shelfEntry.userId, userId)))
		.limit(1);
	return row;
};

export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) error(401, 'Authentication required');

	const row = await loadEntryForUser(params.entryId, locals.user.id);
	if (!row) error(404, 'Shelf entry not found');

	return json({
		id: row.entry.id,
		status: row.entry.status,
		rating: row.entry.rating,
		book: {
			id: row.book.id,
			openLibraryId: row.book.openLibraryId,
			title: row.book.title,
			author: row.book.author
		}
	});
};

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.user) error(401, 'Authentication required');

	let body: PatchBody;
	try {
		body = (await request.json()) as PatchBody;
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const row = await loadEntryForUser(params.entryId, locals.user.id);
	if (!row) error(404, 'Shelf entry not found');

	const updates: Partial<typeof shelfEntry.$inferInsert> = {};
	if (body.status !== undefined) {
		if (!isShelfStatus(body.status)) {
			return json({ error: 'status must be one of to-read, reading, finished' }, { status: 400 });
		}
		updates.status = body.status;
	}
	if (body.rating !== undefined) {
		if (!isValidRating(body.rating)) {
			return json({ error: 'rating must be an integer between 1 and 5, or null' }, { status: 400 });
		}
		updates.rating = body.rating;
	}

	if (Object.keys(updates).length === 0) {
		return json({ error: 'No updatable fields in request body' }, { status: 400 });
	}

	const [updated] = await db
		.update(shelfEntry)
		.set(updates)
		.where(and(eq(shelfEntry.id, params.entryId), eq(shelfEntry.userId, locals.user.id)))
		.returning();

	if (!updated) {
		error(404, 'Shelf entry not found');
	}

	return json({
		id: updated.id,
		status: updated.status,
		rating: updated.rating,
		book: {
			id: row.book.id,
			openLibraryId: row.book.openLibraryId,
			title: row.book.title,
			author: row.book.author
		}
	});
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) error(401, 'Authentication required');

	const row = await loadEntryForUser(params.entryId, locals.user.id);
	if (!row) error(404, 'Shelf entry not found');

	await db
		.delete(shelfEntry)
		.where(and(eq(shelfEntry.id, params.entryId), eq(shelfEntry.userId, locals.user.id)));

	return new Response(null, { status: 204 });
};
