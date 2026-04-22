import { test, expect } from '@playwright/test';

test('Locate add to self button', async ({ page }) => {
	await page.goto('/');

	const navigation = page.getByRole('navigation', { name: 'primary' });
	await navigation.getByRole('link', { name: 'Playground' }).click();

	await expect(page).toHaveURL(/playground/i);

	const addToSelfButton = page.getByRole('button', { name: 'Add to shelf' });
	expect(addToSelfButton).toBeVisible();

	const cancelButton = page.getByRole('button', { name: 'Cancel' });
	await expect(cancelButton).toBeVisible();
});

test('Locate cancel button', async ({ page }) => {
	await page.goto('/');

	const navigation = page.getByRole('navigation', { name: 'primary' });
	await navigation.getByRole('link', { name: 'Playground' }).click();

	await expect(page).toHaveURL(/playground/i);
	const cancelButton = page.getByRole('button', { name: 'Cancel' });
	await expect(cancelButton).toBeVisible();
});

test('Locate first delete button', async ({ page }) => {
	await page.goto('/');

	const navigation = page.getByRole('navigation', { name: 'primary' });
	await navigation.getByRole('link', { name: 'Playground' }).click();

	await expect(page).toHaveURL(/playground/i);

	const firstDeleteButton = page.getByRole('button', { name: 'Delete' }).first();

	await expect(firstDeleteButton).toBeVisible();
});

test('Locate remove button inside the third item in reading list', async ({ page }) => {
	await page.goto('/');

	const navigation = page.getByRole('navigation', { name: 'primary' });

	await navigation.getByRole('link', { name: 'Playground' }).click();

	await expect(page).toHaveURL(/playground/i);

	const list = page.getByRole('list', { name: 'Reading list' });

	// nth -> starts from 0
	const thirdItem = list.getByRole('listitem').nth(2);

	const removeButton = thirdItem.getByRole('button', { name: 'Remove' });

	await expect(removeButton).toBeVisible();
});

test('Locate rate this book button', async ({ page }) => {
	await page.goto('/');

	const navigation = page.getByRole('navigation', { name: 'primary' });

	await navigation.getByRole('link', { name: 'Playground' }).click();

	await expect(page).toHaveURL(/playground/i);

	const article = page.getByRole('article', { name: 'Piranesi by Susanna Clarke' });

	const rateThisBookBtn = article.getByRole('button', { name: 'Rate this book' });

	await expect(rateThisBookBtn).toBeVisible();
});
