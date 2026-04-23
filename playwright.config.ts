import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'tests',
	testIgnore: ['**/labs/fixtures/**', '**/labs/broken-traces/**'],
	webServer: {
		command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: true
	},
	use: {
		baseURL: 'http://127.0.0.1:4173',
		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry'
	},
	projects: [
		{ name: 'setup', testMatch: 'auth.setup.ts' },
		{
			name: 'chromium',
			use: {
				storageState: 'playwright/.authentication/user.json'
			},
			dependencies: ['setup']
		}
	],
	reporter: [
		['html', { open: 'never', outputFolder: 'playwright-report/html' }],
		['json', { outputFile: 'playwright-report/report.json' }],
		['list']
	]
});
