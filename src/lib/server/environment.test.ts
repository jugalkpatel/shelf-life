import { describe, expect, it } from 'vitest';
import {
	DEFAULT_BETTER_AUTH_SECRET,
	DEFAULT_DATABASE_URL,
	DEFAULT_OPEN_LIBRARY_BASE_URL,
	getEnvironmentVariables,
	isTestSeedEnabled
} from './environment';

describe('resolveShelfEnvironmentConfiguration', () => {
	it('uses local development defaults when environment variables are missing', () => {
		expect(getEnvironmentVariables({})).toEqual({
			authOrigin: undefined,
			betterAuthSecret: DEFAULT_BETTER_AUTH_SECRET,
			databaseUrl: DEFAULT_DATABASE_URL,
			openLibraryBaseUrl: DEFAULT_OPEN_LIBRARY_BASE_URL
		});
	});

	it('treats blank strings as missing values', () => {
		expect(
			getEnvironmentVariables({
				ORIGIN: '   ',
				BETTER_AUTH_SECRET: '   ',
				DATABASE_URL: '   ',
				OPEN_LIBRARY_BASE_URL: '   '
			})
		).toEqual({
			authOrigin: undefined,
			betterAuthSecret: DEFAULT_BETTER_AUTH_SECRET,
			databaseUrl: DEFAULT_DATABASE_URL,
			openLibraryBaseUrl: DEFAULT_OPEN_LIBRARY_BASE_URL
		});
	});

	it('keeps explicit environment values intact', () => {
		expect(
			getEnvironmentVariables({
				ORIGIN: 'http://127.0.0.1:4173',
				BETTER_AUTH_SECRET: 'custom-secret-value-with-enough-length-12345',
				DATABASE_URL: 'file:./tmp/test.db',
				OPEN_LIBRARY_BASE_URL: 'https://example.com'
			})
		).toEqual({
			authOrigin: 'http://127.0.0.1:4173',
			betterAuthSecret: 'custom-secret-value-with-enough-length-12345',
			databaseUrl: 'file:./tmp/test.db',
			openLibraryBaseUrl: 'https://example.com'
		});
	});
});

describe('resolveTestSeedEnabled', () => {
	it('defaults to development mode when the variable is missing', () => {
		expect(isTestSeedEnabled({}, true)).toBe(true);
		expect(isTestSeedEnabled({}, false)).toBe(false);
	});

	it('accepts explicit true and false values', () => {
		expect(isTestSeedEnabled({ ENABLE_TEST_SEED: 'true' }, false)).toBe(true);
		expect(isTestSeedEnabled({ ENABLE_TEST_SEED: 'FALSE' }, true)).toBe(false);
	});
});
