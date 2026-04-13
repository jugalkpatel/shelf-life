import { expect, test } from '@playwright/test';

test('home page introduces Shelf and points readers at sign in', async ({ page }) => {
	await page.goto('/');

	await expect(
		page.getByRole('heading', { name: /Build a shelf that remembers what you actually read/i })
	).toBeVisible();
	await expect(page.getByRole('main').getByRole('link', { name: 'Sign in' })).toBeVisible();
	await expect(page.getByRole('navigation', { name: 'Primary' })).toContainText('Search');
});

test('protected routes redirect unauthenticated readers to login', async ({ page }) => {
	await page.goto('/search');
	await expect(page).toHaveURL(/\/login\?returnTo=%2Fsearch$/);

	await page.goto('/shelf');
	await expect(page).toHaveURL(/\/login\?returnTo=%2Fshelf$/);
});

test('login page defaults to sign-in mode and only asks for a display name during account creation', async ({
	page
}) => {
	await page.goto('/login');

	await expect(page.getByRole('heading', { name: 'Sign in to Shelf.' })).toBeVisible();
	await expect(page.getByLabel('Email')).toBeVisible();
	await expect(page.getByLabel('Password')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
	await expect(page.getByLabel('Display name')).toHaveCount(0);

	await page.getByRole('button', { name: 'Need an account? Create one instead.' }).click();

	await expect(page).toHaveURL(/\/login\?mode=create-account$/);
	await expect(page.getByRole('heading', { name: 'Create your Shelf account.' })).toBeVisible();
	await expect(page.getByLabel('Display name')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
});

test('playground page renders all locator-practice sections', async ({ page }) => {
	await page.goto('/playground');

	await expect(page.getByRole('heading', { level: 1, name: /Locator playground/ })).toBeVisible();

	// Verify key section headings exist
	const sectionTitles = [
		'Buttons',
		'Form fields',
		'Text content',
		'Lists and tables',
		'Navigation',
		'Status indicators',
		'Dialogs',
		'Dynamic content',
		'ARIA attributes',
		'Test ID fallbacks',
		'Anti-patterns'
	];

	for (const title of sectionTitles) {
		await expect(page.getByRole('heading', { name: title })).toBeVisible();
	}

	// Verify element counts the lab depends on
	await expect(page.getByRole('list', { name: 'Reading list' }).getByRole('listitem')).toHaveCount(
		4
	);
	await expect(page.getByRole('table', { name: 'Book ratings' }).getByRole('row')).toHaveCount(4); // 1 header + 3 data rows
	await expect(page.getByRole('button', { name: 'Delete' })).toHaveCount(2);
	await expect(page.getByRole('link', { name: 'View details' })).toHaveCount(2);
});
