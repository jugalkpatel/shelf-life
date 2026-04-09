/**
 * Derives the public shelf handle for a user. The handle is the lowercased
 * portion of the user's email address before the `@`. Shelf uses this for the
 * `/shelf/[username]` public reader page so the identifier is stable, URL
 * safe, and does not leak the rest of the address.
 */
export const toPublicShelfHandle = (email: string): string => {
	const [localPart = ''] = email.split('@');
	return localPart.toLowerCase();
};
