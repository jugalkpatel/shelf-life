import path from 'node:path';
import { expect, test as setup } from '@playwright/test';
import { SEEDED_READER, seedFreshDatabase } from './helpers/seed';

const authenticationFile = path.resolve('playwright/.authentication/user.json');

setup('authenticate the seeded reader', async ({ page, request }) => {
	await seedFreshDatabase(request);

	await page.goto('/login');
	await page.getByLabel('Email').fill(SEEDED_READER.email);
	await page.getByLabel('Password').fill(SEEDED_READER.password);
	await page.getByLabel('Display name').fill(SEEDED_READER.name);
	await page.getByRole('button', { name: 'Sign in' }).click();

	await expect(page).toHaveURL(/\/shelf/);

	await page.context().storageState({ path: authenticationFile });
});
