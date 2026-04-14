import { db } from '$lib/server/db';
import { shelfEntry } from '$lib/server/db/schema';

export type CreateShelfEntryInput = {
	userId: string;
	bookId: string;
	status: 'to-read' | 'reading' | 'finished';
	rating?: number | null;
	finishedAt?: Date | null;
};

export const createShelfEntry = async ({
	userId,
	bookId,
	status,
	rating = null,
	finishedAt = null
}: CreateShelfEntryInput): Promise<typeof shelfEntry.$inferSelect> => {
	const [created] = await db
		.insert(shelfEntry)
		.values({ userId, bookId, status, rating, finishedAt })
		.returning();

	if (!created) {
		throw new Error(`Failed to create shelf entry for user ${userId}`);
	}

	return created;
};

export const deleteAllShelfEntries = async (): Promise<void> => {
	await db.delete(shelfEntry);
};
