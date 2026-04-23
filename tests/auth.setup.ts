import { test as setup, expect } from '@playwright/test';
import path from 'node:path';

// TODO 1: get auth file

// NOTE: To run codegen with saved auth state, you must manually start the preview server first.
// playwright codegen does NOT use the webServer from playwright.config.ts.
//
// Step 1 — Build & start the preview server (in a separate terminal):
//   npm run build && npm run preview -- --host 127.0.0.1 --port 4173
//
// Step 2 — Once the server is up at http://127.0.0.1:4173, run codegen:
//   npx playwright codegen --load-storage=playwright/.authentication/user.json http://127.0.0.1:4173

const authenticationFile = path.resolve('playwright/.authentication/user.json');

setup('check login flow of the app', async ({ page }) => {
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
	// TODO 2: save storage state to file

	await page.context().storageState({ path: authenticationFile });
});
