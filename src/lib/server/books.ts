import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { book } from '$lib/server/db/schema';

export type CreateBookInput = {
	openLibraryId: string;
	title: string;
	author: string;
	description?: string | null;
	featuredPosition?: number | null;
};

export const createBook = async ({
	openLibraryId,
	title,
	author,
	description = null,
	featuredPosition = null
}: CreateBookInput): Promise<typeof book.$inferSelect> => {
	const [created] = await db
		.insert(book)
		.values({ openLibraryId, title, author, description, featuredPosition })
		.returning();

	if (!created) {
		throw new Error(`Failed to create book ${openLibraryId}`);
	}

	return created;
};

export const findBookByOpenLibraryId = async (openLibraryId: string) => {
	const [found] = await db
		.select()
		.from(book)
		.where(eq(book.openLibraryId, openLibraryId))
		.limit(1);

	return found ?? null;
};

export const deleteAllBooks = async (): Promise<void> => {
	await db.delete(book);
};
