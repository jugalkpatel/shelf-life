import { describe, expect, it } from 'vitest';
import {
	DEFAULT_BETTER_AUTH_SECRET,
	DEFAULT_DATABASE_URL,
	DEFAULT_OPEN_LIBRARY_BASE_URL,
	resolveShelfEnvironmentConfiguration,
	resolveTestSeedEnabled
} from './environment-configuration';

describe('resolveShelfEnvironmentConfiguration', () => {
	it('uses local development defaults when environment variables are missing', () => {
		expect(resolveShelfEnvironmentConfiguration({})).toEqual({
			authOrigin: undefined,
			betterAuthSecret: DEFAULT_BETTER_AUTH_SECRET,
			databaseUrl: DEFAULT_DATABASE_URL,
			openLibraryBaseUrl: DEFAULT_OPEN_LIBRARY_BASE_URL
		});
	});

	it('treats blank strings as missing values', () => {
		expect(
			resolveShelfEnvironmentConfiguration({
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
			resolveShelfEnvironmentConfiguration({
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
		expect(resolveTestSeedEnabled({}, true)).toBe(true);
		expect(resolveTestSeedEnabled({}, false)).toBe(false);
	});

	it('accepts explicit true and false values', () => {
		expect(resolveTestSeedEnabled({ ENABLE_TEST_SEED: 'true' }, false)).toBe(true);
		expect(resolveTestSeedEnabled({ ENABLE_TEST_SEED: 'FALSE' }, true)).toBe(false);
	});
});
