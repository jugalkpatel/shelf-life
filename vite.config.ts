import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vitest/config';

const shouldEmitBundleStats = process.env.BUNDLE_STATS === '1';

const base = {
	plugins: [
		tailwindcss(),
		sveltekit(),
		...(shouldEmitBundleStats
			? [
					visualizer({
						filename: path.resolve('build/stats.html'),
						template: 'treemap',
						gzipSize: true,
						brotliSize: true,
						emitFile: false
					}),
					visualizer({
						filename: path.resolve('build/stats.json'),
						template: 'raw-data',
						gzipSize: true,
						brotliSize: true,
						emitFile: false
					})
				]
			: [])
	],
	test: {
		include: ['src/**/*.test.ts']
	}
};

export default defineConfig(
	process.env.VITEST ? { ...base, resolve: { conditions: ['browser'] } } : base
);
