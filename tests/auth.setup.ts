import { expect, test as setup } from '@playwright/test';
import path from 'node:path';

const authenticationFile = path.resolve('playwright/.authentication/user.json');

setup('authenticate', async ({ page }) => {
	await page.goto('/login');
	await page.getByLabel('Email').fill('steve@frontendmasters.com');
	await page.getByLabel('Password').fill('password123');
	await page.getByRole('button', { name: 'Sign in' }).click();
	await expect(page).toHaveURL('/shelf');

	await page.context().storageState({ path: authenticationFile });
});
