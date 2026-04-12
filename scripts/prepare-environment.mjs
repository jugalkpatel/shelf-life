import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const rootDirectory = process.cwd();
const environmentExamplePath = path.join(rootDirectory, '.env.example');
const environmentPath = path.join(rootDirectory, '.env');
const temporaryDirectoryPath = path.join(rootDirectory, 'tmp');

mkdirSync(temporaryDirectoryPath, { recursive: true });

if (!existsSync(environmentPath) && existsSync(environmentExamplePath)) {
	copyFileSync(environmentExamplePath, environmentPath);
	console.log('[prepare] Created .env from .env.example.');
}
