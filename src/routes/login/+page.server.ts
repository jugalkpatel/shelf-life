import { fail, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import {
	defaultAuthenticatedPath,
	isValidEmailAddress,
	resolveAuthenticatedPath
} from '$lib/authentication-navigation';
import { auth } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

type AuthenticationMode = 'sign-in' | 'create-account';

const resolveAuthenticationMode = (value: string | null): AuthenticationMode =>
	value === 'create-account' ? 'create-account' : 'sign-in';

const createAuthenticationModePath = (mode: AuthenticationMode, returnToPath: string) => {
	const searchParams = new URLSearchParams();

	if (mode === 'create-account') {
		searchParams.set('mode', mode);
	}

	if (returnToPath !== defaultAuthenticatedPath) {
		searchParams.set('returnTo', returnToPath);
	}

	const queryString = searchParams.toString();
	return queryString ? `/login?${queryString}` : '/login';
};

export const load: PageServerLoad = async ({ locals, url }) => {
	const returnToPath = resolveAuthenticatedPath(url.searchParams.get('returnTo'));
	const mode = resolveAuthenticationMode(url.searchParams.get('mode'));

	if (locals.user) {
		throw redirect(303, returnToPath);
	}

	return {
		returnTo: returnToPath,
		mode,
		signInPath: createAuthenticationModePath('sign-in', returnToPath),
		createAccountPath: createAuthenticationModePath('create-account', returnToPath)
	};
};

const readAuthenticationFormData = async (request: Request) => {
	const formData = await request.formData();

	return {
		email: formData.get('email')?.toString().trim() ?? '',
		password: formData.get('password')?.toString() ?? '',
		name: formData.get('name')?.toString().trim() ?? '',
		returnTo: resolveAuthenticatedPath(formData.get('returnTo')?.toString())
	};
};

const validateEmailAddress = (emailAddress: string) => {
	if (!isValidEmailAddress(emailAddress)) {
		return fail(400, { message: 'Enter a valid email address.' });
	}

	return null;
};

const createFailure = (error: unknown, fallbackMessage: string) => {
	if (error instanceof APIError) {
		return fail(400, { message: error.message || fallbackMessage });
	}

	return fail(500, { message: fallbackMessage });
};

export const actions: Actions = {
	signInEmail: async ({ request }) => {
		const { email, password, returnTo } = await readAuthenticationFormData(request);
		const emailValidationFailure = validateEmailAddress(email);

		if (emailValidationFailure) {
			return emailValidationFailure;
		}

		try {
			await auth.api.signInEmail({
				body: {
					email,
					password
				}
			});
		} catch (error) {
			return createFailure(error, 'We could not sign you in with those details.');
		}

		throw redirect(303, returnTo || defaultAuthenticatedPath);
	},
	signUpEmail: async ({ request }) => {
		const { email, password, name, returnTo } = await readAuthenticationFormData(request);
		const emailValidationFailure = validateEmailAddress(email);

		if (emailValidationFailure) {
			return emailValidationFailure;
		}

		try {
			await auth.api.signUpEmail({
				body: {
					email,
					password,
					name: name || 'Shelf reader'
				}
			});
		} catch (error) {
			return createFailure(error, 'We could not create that account.');
		}

		throw redirect(303, returnTo || defaultAuthenticatedPath);
	}
};
