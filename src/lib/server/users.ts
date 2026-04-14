import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/password';

export type CreateUserInput = {
	email: string;
	password: string;
	name: string;
};

export const findUserByEmail = async (email: string) => {
	const [found] = await db.select().from(user).where(eq(user.email, email)).limit(1);
	return found ?? null;
};

export const createUser = async ({
	email,
	password,
	name
}: CreateUserInput): Promise<typeof user.$inferSelect> => {
	const passwordHash = await hashPassword(password);
	const [created] = await db.insert(user).values({ email, name, passwordHash }).returning();

	if (!created) {
		throw new Error(`Failed to create user ${email}`);
	}

	return created;
};

export const deleteAllUsers = async (): Promise<void> => {
	await db.delete(user);
};
