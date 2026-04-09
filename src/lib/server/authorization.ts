import { error } from '@sveltejs/kit';

type AuthenticatedUser = { email?: string | null };

const ADMINISTRATOR_EMAILS = new Set(['admin@example.com']);

/**
 * Returns `true` when the given user should be treated as a Shelf
 * administrator. Admin status is currently tracked by a hard-coded allowlist
 * of email addresses so the starter can demonstrate the permission flow
 * without needing an additional database column.
 */
const isAdministrator = (user: AuthenticatedUser | undefined): boolean => {
	if (!user?.email) return false;
	return ADMINISTRATOR_EMAILS.has(user.email.toLowerCase());
};

/**
 * Guard helper for route handlers that must only run for authenticated
 * administrators. Throws a 401 when the request is anonymous and a 403 when
 * the signed-in reader is not in the administrator allowlist.
 */
export const requireAdministrator = <T extends AuthenticatedUser>(user: T | undefined): T => {
	if (!user) {
		error(401, 'Authentication required');
	}
	if (!isAdministrator(user)) {
		error(403, 'Administrator privilege required');
	}
	return user;
};
