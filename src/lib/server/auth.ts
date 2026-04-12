import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { resolveShelfEnvironmentConfiguration } from '$lib/server/environment-configuration';

const environmentConfiguration = resolveShelfEnvironmentConfiguration(env);

export const auth = betterAuth({
	...(environmentConfiguration.authOrigin ? { baseURL: environmentConfiguration.authOrigin } : {}),
	secret: environmentConfiguration.betterAuthSecret,
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	emailAndPassword: { enabled: true },
	plugins: [
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
