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
});

test('logged in users can see their shelf', async ({ page }) => {
	await page.goto('/shelf');
	await page.getByLabel('Primary').getByRole('link', { name: 'Shelf' }).click();
	await page.getByRole('heading', { name: "Steve's shelf" }).click();
});

test('clicking on "Design System" in the primary navigation takes readers to the design system page', async ({
	page
}) => {
	await page.goto('/');

	const primaryNavigation = page.getByRole('navigation', { name: 'Primary' });
	await primaryNavigation.getByRole('link', { name: 'Design system' }).click();

	await expect(page).toHaveURL('/design-system');
});
