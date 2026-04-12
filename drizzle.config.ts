import { defineConfig } from 'drizzle-kit';
import { resolveShelfEnvironmentConfiguration } from './src/lib/server/environment-configuration';

const environmentConfiguration = resolveShelfEnvironmentConfiguration(process.env);

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: { url: environmentConfiguration.databaseUrl },
	verbose: true,
	strict: true
});
