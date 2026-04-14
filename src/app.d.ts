// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

export interface User {
	id: string;
	name: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Session {
	id: string;
	token: string;
	expiresAt: Date;
	createdAt: Date;
	userId: string;
}

declare global {
	namespace App {
		interface Locals {
			user?: User;
			session?: Session;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
