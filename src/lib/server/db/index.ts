import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { resolveShelfEnvironmentConfiguration } from '$lib/server/environment-configuration';

const environmentConfiguration = resolveShelfEnvironmentConfiguration(env);

const ensureLocalDatabaseDirectoryExists = (databaseUrl: string) => {
	if (!databaseUrl.startsWith('file:')) {
		return;
	}

	const localDatabasePath = databaseUrl.slice('file:'.length);
	if (
		!localDatabasePath ||
		localDatabasePath === ':memory:' ||
		localDatabasePath.startsWith('//')
	) {
		return;
	}

	const databaseDirectory = path.dirname(localDatabasePath);
	if (!databaseDirectory || databaseDirectory === '.') {
		return;
	}

	mkdirSync(databaseDirectory, { recursive: true });
};

ensureLocalDatabaseDirectoryExists(environmentConfiguration.databaseUrl);

const client = createClient({ url: environmentConfiguration.databaseUrl });

export const db = drizzle(client, { schema });
