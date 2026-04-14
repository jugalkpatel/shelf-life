<script lang="ts">
	import { page } from '$app/state';
	import Application from '$lib/components/shell.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutData } from './$types';
	import type { Pathname } from '$app/types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	const titles: Partial<Record<Pathname, string>> = {
		'/': 'Shelf',
		'/login': 'Sign in',
		'/search': 'Search',
		'/shelf': 'Your shelf',
		'/design-system': 'Design system',
		'/playground': 'Locator playground'
	};

	const title = $derived(titles[page.url.pathname as keyof typeof titles] ?? 'Shelf');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{title} | Shelf</title>
	<meta
		name="description"
		content="Shelf helps you search for books, build a shelf, rate what you finish, and track your reading goals."
	/>
</svelte:head>

<Application currentPath={page.url.pathname} currentUser={data.user}>
	{@render children()}
</Application>
