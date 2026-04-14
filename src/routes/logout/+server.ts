import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { signOut } from '$lib/server/session';

export const POST: RequestHandler = async ({ cookies }) => {
	await signOut(cookies);

	throw redirect(302, '/');
};
