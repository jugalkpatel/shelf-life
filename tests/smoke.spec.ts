import { expect, test } from '@playwright/test';

test('home page introduces Shelf and exposes the public starter navigation', async ({ page }) => {
	await page.goto('/');

	await expect(
		page.getByRole('heading', { name: /Build a shelf that remembers what you actually read/i })
	).toBeVisible();

	const primaryNavigation = page.getByRole('navigation', { name: 'Primary' });

	await expect(primaryNavigation.getByRole('link', { name: 'Search' })).toHaveAttribute(
		'href',
		'/search'
	);
	await expect(primaryNavigation.getByRole('link', { name: 'Design system' })).toHaveAttribute(
		'href',
		'/design-system'
	);
	await expect(primaryNavigation.getByRole('link', { name: 'Playground' })).toHaveAttribute(
		'href',
		'/playground'
	);
	await expect(page.getByRole('banner').getByRole('link', { name: 'Sign in' })).toHaveAttribute(
		'href',
		'/login'
	);
});

test('protected routes redirect unauthenticated readers to login', async ({ page }) => {
	await page.goto('/search');
	await expect(page).toHaveURL(/\/login\?returnTo=%2Fsearch$/);

	await page.goto('/shelf');
	await expect(page).toHaveURL(/\/login\?returnTo=%2Fshelf$/);
});
