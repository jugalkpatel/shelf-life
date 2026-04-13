import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { getEnvironmentVariables } from '$lib/server/environment';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';
import { sveltekitCookies } from 'better-auth/svelte-kit';

const environmentConfiguration = getEnvironmentVariables(env);

export const auth = betterAuth({
	...(environmentConfiguration.authOrigin ? { baseURL: environmentConfiguration.authOrigin } : {}),
	secret: environmentConfiguration.betterAuthSecret,
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	emailAndPassword: { enabled: true },
	plugins: [
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
