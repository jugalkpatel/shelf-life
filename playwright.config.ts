import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'tests/end-to-end',
	testMatch: /smoke\.spec\.ts/,
	webServer: {
		command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
		url: 'http://127.0.0.1:4173'
	},
	use: {
		baseURL: 'http://127.0.0.1:4173'
	}
});
