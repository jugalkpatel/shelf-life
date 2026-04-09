import { eq } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { book } from '$lib/server/db/schema';
import { requireAdministrator } from '$lib/server/authorization';
import type { RequestHandler } from './$types';

/**
 * Admin surface for featuring books on the public home page. Only Shelf
 * administrators may call this endpoint — `requireAdministrator` throws a 403
 * when the signed-in reader is not in the administrator allowlist.
 */

type FeatureBookBody = {
	openLibraryId?: string;
	position?: number | null;
};

export const POST: RequestHandler = async ({ locals, request }) => {
	requireAdministrator(locals.user);

	let body: FeatureBookBody;
	try {
		body = (await request.json()) as FeatureBookBody;
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const openLibraryId = body.openLibraryId?.trim();
	if (!openLibraryId) {
		return json({ error: 'openLibraryId is required' }, { status: 400 });
	}

	const rawPosition = body.position;
	if (rawPosition !== null && rawPosition !== undefined) {
		if (typeof rawPosition !== 'number' || !Number.isInteger(rawPosition) || rawPosition < 0) {
			return json({ error: 'position must be null or a non-negative integer' }, { status: 400 });
		}
	}

	const [target] = await db
		.select()
		.from(book)
		.where(eq(book.openLibraryId, openLibraryId))
		.limit(1);

	if (!target) {
		error(404, 'Book not found');
	}

	await db
		.update(book)
		.set({ featuredPosition: rawPosition ?? null })
		.where(eq(book.id, target.id));

	return json({
		ok: true,
		book: {
			id: target.id,
			openLibraryId: target.openLibraryId,
			featuredPosition: rawPosition ?? null
		}
	});
};
