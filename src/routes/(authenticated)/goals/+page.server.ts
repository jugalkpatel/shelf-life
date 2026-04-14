import { fail, redirect } from '@sveltejs/kit';
import { getReadingGoalProgress, upsertReadingGoal } from '$lib/server/reading-goals';
import type { Actions, PageServerLoad } from './$types';

const currentYear = () => new Date().getUTCFullYear();

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/login?returnTo=%2Fgoals');
	const year = currentYear();
	const progress = await getReadingGoalProgress(locals.user.id, year);
	return {
		user: locals.user,
		progress
	};
};

export const actions: Actions = {
	setGoal: async ({ locals, request }) => {
		if (!locals.user) throw redirect(303, '/login?returnTo=%2Fgoals');

		const formData = await request.formData();
		const rawTarget = formData.get('targetBooks');
		const targetBooksValue = Number.parseInt(String(rawTarget ?? ''), 10);

		if (!Number.isInteger(targetBooksValue) || targetBooksValue < 1 || targetBooksValue > 999) {
			return fail(400, {
				message: 'Enter a whole number between 1 and 999.'
			});
		}

		await upsertReadingGoal(locals.user.id, currentYear(), targetBooksValue);
		return { savedAt: new Date().toISOString() };
	}
};
