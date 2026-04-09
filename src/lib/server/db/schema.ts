import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';

export const book = sqliteTable('book', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	openLibraryId: text('open_library_id').notNull().unique(),
	title: text('title').notNull(),
	author: text('author').notNull(),
	description: text('description'),
	featuredPosition: integer('featured_position'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
		.notNull()
});

export const readingGoal = sqliteTable('reading_goal', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	year: integer('year').notNull(),
	targetBooks: integer('target_books').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
		.notNull()
});

export const shelfEntry = sqliteTable('shelf_entry', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	bookId: text('book_id')
		.notNull()
		.references(() => book.id, { onDelete: 'cascade' }),
	status: text('status', { enum: ['to-read', 'reading', 'finished'] })
		.notNull()
		.default('to-read'),
	rating: integer('rating'),
	finishedAt: integer('finished_at', { mode: 'timestamp_ms' }),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
		.notNull()
});

export * from './auth.schema';
