import { expect, test } from '@playwright/test';

test('"Remove" in the third list item', async ({ page }) => {
	await page.goto('/playground');
	const readingList = page.getByRole('list', { name: 'Reading list' });
	const thirdListItem = readingList.getByRole('listitem').nth(2);
	await expect(thirdListItem.getByRole('button', { name: 'Remove' })).toBeVisible();
});
