import { and, eq, inArray } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { book, shelfEntry } from '$lib/server/db/schema';
import { searchOpenLibrary, type OpenLibrarySearchResult } from '$lib/server/open-library';
import type { PageServerLoad } from './$types';

type SearchResultView = OpenLibrarySearchResult & {
	onShelf: boolean;
	shelfEntryId: string | null;
	rating: number | null;
};

export const load: PageServerLoad = async ({ fetch, url, locals }) => {
	const query = url.searchParams.get('query')?.trim() ?? '';

	if (!query) {
		return {
			query,
			user: locals.user,
			results: [] as SearchResultView[]
		};
	}

	const upstreamResults = await searchOpenLibrary(query, fetch);

	if (upstreamResults.length === 0 || !locals.user) {
		const results: SearchResultView[] = upstreamResults.map((item) => ({
			...item,
			onShelf: false,
			shelfEntryId: null,
			rating: null
		}));
		return { query, user: locals.user, results };
	}

	const openLibraryIds = upstreamResults.map((item) => item.openLibraryId);
	const onShelfRows = await db
		.select({ entry: shelfEntry, book })
		.from(shelfEntry)
		.innerJoin(book, eq(shelfEntry.bookId, book.id))
		.where(and(eq(shelfEntry.userId, locals.user.id), inArray(book.openLibraryId, openLibraryIds)));

	const onShelfByOpenLibraryId = new Map(
		onShelfRows.map((row) => [row.book.openLibraryId, row.entry])
	);

	const results: SearchResultView[] = upstreamResults.map((item) => {
		const entry = onShelfByOpenLibraryId.get(item.openLibraryId) ?? null;
		return {
			...item,
			onShelf: entry !== null,
			shelfEntryId: entry?.id ?? null,
			rating: entry?.rating ?? null
		};
	});

	return { query, user: locals.user, results };
};
