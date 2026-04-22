import { test, expect } from '@playwright/test';

test('check login flow of the app', async ({ page }) => {
	await page.goto('/');
	const signinButton = page.getByRole('link', { name: 'Sign in' });
	await expect(signinButton).toBeVisible();
	await signinButton.click();
	await page.getByRole('textbox', { name: 'Email Use the email address' }).click();
	await page.getByRole('textbox', { name: 'Email Use the email address' }).fill('abc@gmail.com');
	await page.getByRole('textbox', { name: 'Password' }).click();
	await page.getByRole('textbox', { name: 'Password' }).fill('abc@gmail');
	await page.getByRole('button', { name: 'Sign in' }).click();
	await expect(page).toHaveURL(/shelf/i);
});
