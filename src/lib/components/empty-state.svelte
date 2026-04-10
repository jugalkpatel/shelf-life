<script lang="ts">
	import Button from './button.svelte';

	type PagePathname =
		| '/'
		| '/login'
		| '/design-system'
		| '/playground'
		| '/search'
		| '/shelf'
		| '/goals'
		| '/admin/goals';

	let {
		title,
		message,
		actionLabel,
		actionHref
	}: {
		title: string;
		message: string;
		actionLabel?: string;
		actionHref?: PagePathname;
	} = $props();
</script>

<div
	class="rounded-[var(--radius-card)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] p-8 text-center"
>
	<h3 class="font-display text-2xl text-[var(--color-ink)]">{title}</h3>
	<p class="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">{message}</p>

	{#if actionLabel && actionHref}
		<div class="mt-5">
			<Button href={actionHref}>{actionLabel}</Button>
		</div>
	{/if}
</div>
