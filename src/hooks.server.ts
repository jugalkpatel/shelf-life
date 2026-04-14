import type { Handle } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/session';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('shelf_session');

	if (token) {
		const result = await getSessionUser(token);
		if (result) {
			event.locals.user = result.user;
			event.locals.session = result.session;
		}
	}

	return resolve(event);
};
