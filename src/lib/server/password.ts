import { timingSafeEqual } from 'node:crypto';

const ITERATIONS = 100_000;
const HASH_BYTES = 32;

export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(password),
		'PBKDF2',
		false,
		['deriveBits']
	);
	const hash = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt,
			iterations: ITERATIONS,
			hash: 'SHA-256'
		},
		key,
		HASH_BYTES * 8
	);
	const saltHex = Buffer.from(salt).toString('hex');
	const hashHex = Buffer.from(hash).toString('hex');
	return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
	const [saltHex, hashHex] = stored.split(':');
	if (!saltHex || !hashHex) return false;

	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(password),
		'PBKDF2',
		false,
		['deriveBits']
	);
	const hash = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: Buffer.from(saltHex, 'hex'),
			iterations: ITERATIONS,
			hash: 'SHA-256'
		},
		key,
		HASH_BYTES * 8
	);
	const candidate = Buffer.from(hash).toString('hex');
	if (candidate.length !== hashHex.length) return false;
	return timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(hashHex, 'hex'));
}
