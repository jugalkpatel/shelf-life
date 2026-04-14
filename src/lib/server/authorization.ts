import { error } from '@sveltejs/kit';

type AuthenticatedUser = { isAdmin?: boolean | null };

/**
 * Guard helper for route handlers that must only run for authenticated
 * administrators. Throws a 401 when the request is anonymous and a 403 when
 * the signed-in reader does not have administrator access.
 */
export const requireAdministrator = <T extends AuthenticatedUser>(user: T | undefined): T => {
	if (!user) {
		error(401, 'Authentication required');
	}

	if (!user.isAdmin) {
		error(403, 'Administrator privilege required');
	}

	return user;
};
