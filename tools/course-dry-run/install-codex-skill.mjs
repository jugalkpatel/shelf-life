#!/usr/bin/env node

import { cp, lstat, mkdir, readlink, rm, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '../..');
const skillName = 'course-dry-run';

function printUsage() {
	console.log(`Usage: node tools/course-dry-run/install-codex-skill.mjs [options]

Options:
  --copy               Copy the skill instead of creating a symlink
  --dest-root <path>   Override the Codex skills root
  --help               Show this help message
`);
}

function parseArguments(argv) {
	const argumentsMap = {};

	for (let index = 0; index < argv.length; index += 1) {
		const token = argv[index];

		if (token === '--help') {
			argumentsMap.help = true;
			continue;
		}

		if (token === '--copy') {
			argumentsMap.copy = true;
			continue;
		}

		if (!token.startsWith('--')) {
			throw new Error(`Unexpected argument: ${token}`);
		}

		const key = token.slice(2);
		const value = argv[index + 1];

		if (!value || value.startsWith('--')) {
			throw new Error(`Missing value for --${key}`);
		}

		argumentsMap[key] = value;
		index += 1;
	}

	return argumentsMap;
}

async function removeIfPresent(targetPath) {
	try {
		await rm(targetPath, { force: true, recursive: true });
	} catch (error) {
		if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
			return;
		}

		throw error;
	}
}

async function installSymlink(sourcePath, destinationPath) {
	try {
		const stat = await lstat(destinationPath);

		if (stat.isSymbolicLink()) {
			const currentTarget = await readlink(destinationPath);

			if (path.resolve(path.dirname(destinationPath), currentTarget) === sourcePath) {
				console.error(`Codex skill already points at ${sourcePath}`);
				return;
			}
		}

		await removeIfPresent(destinationPath);
	} catch (error) {
		if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
			throw error;
		}
	}

	await symlink(sourcePath, destinationPath, 'dir');
	console.error(`Linked ${destinationPath} -> ${sourcePath}`);
}

async function installCopy(sourcePath, destinationPath) {
	await removeIfPresent(destinationPath);
	await cp(sourcePath, destinationPath, { recursive: true });
	console.error(`Copied ${sourcePath} -> ${destinationPath}`);
}

async function main() {
	const argumentsMap = parseArguments(process.argv.slice(2));

	if (argumentsMap.help) {
		printUsage();
		return;
	}

	const codexHome = process.env.CODEX_HOME ?? path.join(os.homedir(), '.codex');
	const destinationRoot = path.resolve(argumentsMap['dest-root'] ?? path.join(codexHome, 'skills'));
	const sourcePath = path.join(repositoryRoot, '.codex/skills', skillName);
	const destinationPath = path.join(destinationRoot, skillName);

	await mkdir(destinationRoot, { recursive: true });

	if (argumentsMap.copy) {
		await installCopy(sourcePath, destinationPath);
		return;
	}

	await installSymlink(sourcePath, destinationPath);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
});
