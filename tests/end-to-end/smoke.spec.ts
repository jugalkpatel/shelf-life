import { expect, test } from './fixtures';

test('home page renders the Shelf starter shell', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('heading', { name: /Shelf is the foundation/i })).toBeVisible();
	await expect(page.getByRole('main').getByRole('link', { name: 'Sign in' })).toBeVisible();
	await expect(
		page.getByRole('main').getByRole('link', { name: 'View the design system' })
	).toBeVisible();
});

test('protected routes redirect unauthenticated readers to login', async ({ page }) => {
	await page.goto('/search');
	await expect(page).toHaveURL(/\/login\?returnTo=%2Fsearch$/);

	await page.goto('/shelf');
	await expect(page).toHaveURL(/\/login\?returnTo=%2Fshelf$/);
});

test('login page renders starter authentication controls', async ({ page }) => {
	await page.goto('/login');

	await expect(page.getByLabel('Email')).toBeVisible();
	await expect(page.getByLabel('Password')).toBeVisible();
	await expect(page.getByLabel('Display name')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
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

test('creating an account returns the reader to the protected page they asked for', async ({
	page
}, testInfo) => {
	const uniqueIdentifier = `${Date.now()}-${testInfo.parallelIndex}`;

	await page.goto('/search?query=piranesi');
	await expect(page).toHaveURL(/\/login\?returnTo=%2Fsearch%3Fquery%3Dpiranesi$/);

	await page.getByLabel('Email').fill(`reader-${uniqueIdentifier}@example.com`);
	await page.getByLabel('Password').fill('ShelfStarter123!');
	await page.getByLabel('Display name').fill('Course Reader');
	await page.getByRole('button', { name: 'Create account' }).click();

	await expect(page).toHaveURL(/\/search\?query=piranesi$/);
	await expect(page.getByRole('heading', { level: 1, name: /Search the library/ })).toBeVisible();
});
