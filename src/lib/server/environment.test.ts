import { describe, expect, it } from 'vitest';
import {
	DEFAULT_DATABASE_URL,
	DEFAULT_OPEN_LIBRARY_BASE_URL,
	getEnvironmentVariables
} from './environment';

describe('resolveShelfEnvironmentConfiguration', () => {
	it('uses local development defaults when environment variables are missing', () => {
		expect(getEnvironmentVariables({})).toEqual({
			databaseUrl: DEFAULT_DATABASE_URL,
			openLibraryBaseUrl: DEFAULT_OPEN_LIBRARY_BASE_URL
		});
	});

	it('treats blank strings as missing values', () => {
		expect(
			getEnvironmentVariables({
				DATABASE_URL: '   ',
				OPEN_LIBRARY_BASE_URL: '   '
			})
		).toEqual({
			databaseUrl: DEFAULT_DATABASE_URL,
			openLibraryBaseUrl: DEFAULT_OPEN_LIBRARY_BASE_URL
		});
	});

	it('keeps explicit environment values intact', () => {
		expect(
			getEnvironmentVariables({
				DATABASE_URL: 'file:./tmp/test.db',
				OPEN_LIBRARY_BASE_URL: 'https://example.com'
			})
		).toEqual({
			databaseUrl: 'file:./tmp/test.db',
			openLibraryBaseUrl: 'https://example.com'
		});
	});
});
