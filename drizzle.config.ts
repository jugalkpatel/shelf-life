import { defineConfig } from 'drizzle-kit';
import { getEnvironmentVariables } from './src/lib/server/environment';

const environment = getEnvironmentVariables(process.env);

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: { url: environment.databaseUrl },
	verbose: true,
	strict: true
});
