import { and, between, eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { readingGoal, shelfEntry, user } from '$lib/server/db/schema';

/**
 * Returns the inclusive millisecond timestamps for the start and end of a
 * calendar year in UTC.
 */
const boundsForYear = (year: number): { startMs: number; endMs: number } => ({
	startMs: Date.UTC(year, 0, 1, 0, 0, 0, 0),
	endMs: Date.UTC(year, 11, 31, 23, 59, 59, 999)
});

type ReadingGoalProgress = {
	year: number;
	targetBooks: number | null;
	finishedBooks: number;
	percentage: number;
	goalMet: boolean;
};

const buildProgress = (
	year: number,
	targetBooks: number | null,
	finishedBooks: number
): ReadingGoalProgress => {
	const percentage =
		targetBooks && targetBooks > 0
			? Math.min(100, Math.round((finishedBooks / targetBooks) * 100))
			: 0;
	return {
		year,
		targetBooks,
		finishedBooks,
		percentage,
		goalMet: targetBooks !== null && finishedBooks >= targetBooks
	};
};

/**
 * Reads the active reading goal and the number of finished books for the
 * given user in the given year. The target is `null` when the reader has
 * not set a goal for the year yet.
 */
export const getReadingGoalProgress = async (
	userId: string,
	year: number
): Promise<ReadingGoalProgress> => {
	const { startMs, endMs } = boundsForYear(year);
	const start = new Date(startMs);
	const end = new Date(endMs);

	const [goalRow] = await db
		.select({ targetBooks: readingGoal.targetBooks })
		.from(readingGoal)
		.where(and(eq(readingGoal.userId, userId), eq(readingGoal.year, year)))
		.limit(1);

	const finishedRows = await db
		.select({ finishedAt: shelfEntry.finishedAt })
		.from(shelfEntry)
		.where(
			and(
				eq(shelfEntry.userId, userId),
				eq(shelfEntry.status, 'finished'),
				between(shelfEntry.finishedAt, start, end)
			)
		);

	return buildProgress(year, goalRow?.targetBooks ?? null, finishedRows.length);
};

/**
 * Upserts a reading goal for a user + year pair. Returns the updated goal.
 */
export const upsertReadingGoal = async (
	userId: string,
	year: number,
	targetBooks: number
): Promise<{ year: number; targetBooks: number }> => {
	const [existing] = await db
		.select()
		.from(readingGoal)
		.where(and(eq(readingGoal.userId, userId), eq(readingGoal.year, year)))
		.limit(1);

	if (existing) {
		await db.update(readingGoal).set({ targetBooks }).where(eq(readingGoal.id, existing.id));
	} else {
		await db.insert(readingGoal).values({ userId, year, targetBooks });
	}

	return { year, targetBooks };
};

type AdministratorGoalSummary = {
	year: number;
	totalReaders: number;
	readersWithGoal: number;
	totalGoalTarget: number;
	totalFinished: number;
	perReader: Array<{
		userId: string;
		name: string;
		targetBooks: number | null;
		finishedBooks: number;
		percentage: number;
	}>;
};

/**
 * Aggregate stats across all Shelf readers for the given year. Used by the
 * administrator dashboard at `/admin/goals`.
 */
export const getAdministratorGoalSummary = async (
	year: number
): Promise<AdministratorGoalSummary> => {
	const { startMs, endMs } = boundsForYear(year);
	const start = new Date(startMs);
	const end = new Date(endMs);

	const readers = await db.select({ id: user.id, name: user.name }).from(user);

	const goalRows = await db
		.select({ userId: readingGoal.userId, targetBooks: readingGoal.targetBooks })
		.from(readingGoal)
		.where(eq(readingGoal.year, year));

	const finishedCounts = await db
		.select({
			userId: shelfEntry.userId,
			finishedBooks: sql<number>`count(*)`.as('finished_books')
		})
		.from(shelfEntry)
		.where(and(eq(shelfEntry.status, 'finished'), between(shelfEntry.finishedAt, start, end)))
		.groupBy(shelfEntry.userId);

	const targetByUser = new Map(goalRows.map((row) => [row.userId, row.targetBooks]));
	const finishedByUser = new Map(
		finishedCounts.map((row) => [row.userId, Number(row.finishedBooks)])
	);

	const perReader = readers
		.map((reader) => {
			const targetBooks = targetByUser.get(reader.id) ?? null;
			const finishedBooks = finishedByUser.get(reader.id) ?? 0;
			const percentage =
				targetBooks && targetBooks > 0
					? Math.min(100, Math.round((finishedBooks / targetBooks) * 100))
					: 0;
			return {
				userId: reader.id,
				name: reader.name,
				targetBooks,
				finishedBooks,
				percentage
			};
		})
		.sort((a, b) => b.finishedBooks - a.finishedBooks);

	return {
		year,
		totalReaders: readers.length,
		readersWithGoal: goalRows.length,
		totalGoalTarget: goalRows.reduce((sum, row) => sum + row.targetBooks, 0),
		totalFinished: perReader.reduce((sum, row) => sum + row.finishedBooks, 0),
		perReader
	};
};
