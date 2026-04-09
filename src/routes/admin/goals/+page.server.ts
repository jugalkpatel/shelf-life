import { redirect } from '@sveltejs/kit';
import { requireAdministrator } from '$lib/server/authorization';
import { createLoginPath } from '$lib/authentication-navigation';
import { getAdministratorGoalSummary } from '$lib/server/reading-goals';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, createLoginPath(`${url.pathname}${url.search}`));
	}
	requireAdministrator(locals.user);

	const year = new Date().getUTCFullYear();
	const summary = await getAdministratorGoalSummary(year);

	return { user: locals.user, summary };
};
