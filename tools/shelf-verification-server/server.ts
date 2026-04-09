#!/usr/bin/env node
/**
 * Shelf custom verification MCP server.
 *
 * Exposes a single tool, `verify_shelf_page`, that launches Chromium,
 * navigates to a reader's public shelf URL, counts the rendered book
 * articles, collects any console errors, and returns a structured result.
 *
 * Registered through the repository-local `.mcp.json` at the root of the
 * Shelf workshop repository. The target base URL defaults to
 * `http://127.0.0.1:4173` and can be overridden with `SHELF_BASE_URL`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { chromium } from 'playwright';
import { z } from 'zod';

const STORAGE_STATE_PATH = path.resolve('playwright/.authentication/user.json');
const baseUrl = process.env.SHELF_BASE_URL ?? 'http://127.0.0.1:4173';

const server = new McpServer({
	name: 'shelf-verification',
	version: '0.1.0'
});

type VerifyShelfPageResult = {
	ok: boolean;
	bookCount: number;
	consoleErrors: string[];
	url: string;
};

server.registerTool(
	'verify_shelf_page',
	{
		description:
			'Open the Shelf app and verify the public /shelf/[username] route renders correctly. Returns the rendered book count, any console errors, and the resolved URL.',
		inputSchema: {
			username: z.string().min(1).describe('The reader handle, e.g. "alice" for alice@example.com')
		},
		outputSchema: {
			ok: z.boolean(),
			bookCount: z.number().int().nonnegative(),
			consoleErrors: z.array(z.string()),
			url: z.string()
		}
	},
	async ({ username }) => {
		const targetUrl = `${baseUrl}/shelf/${encodeURIComponent(username)}`;
		const browser = await chromium.launch();
		try {
			// Reuse the authenticated storage state when it exists — even though
			// the /shelf/[username] page is public, the Playwright session stays
			// consistent with the rest of the workshop tooling.
			const contextOptions = fs.existsSync(STORAGE_STATE_PATH)
				? { storageState: STORAGE_STATE_PATH }
				: {};
			const context = await browser.newContext(contextOptions);
			const page = await context.newPage();

			const consoleErrors: string[] = [];
			page.on('console', (message) => {
				if (message.type() === 'error') {
					consoleErrors.push(message.text());
				}
			});

			await page.goto(targetUrl);
			await page.getByRole('heading', { level: 1 }).waitFor();

			const bookCount = await page.getByRole('article').count();

			const result: VerifyShelfPageResult = {
				ok: consoleErrors.length === 0 && bookCount >= 0,
				bookCount,
				consoleErrors,
				url: targetUrl
			};

			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(result, null, 2)
					}
				],
				structuredContent: result
			};
		} finally {
			await browser.close();
		}
	}
);

const transport = new StdioServerTransport();
await server.connect(transport);
