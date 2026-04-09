<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import SurfaceCard from '$lib/components/surface-card.svelte';
	import EmptyState from '$lib/components/empty-state.svelte';
	import { shelfStatusLabels } from '$lib/shelf';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="space-y-8">
	<PageHeader
		eyebrow="Reader shelf"
		title={`${data.owner.name}'s shelf`}
		description={`Public view of @${data.owner.handle}'s reading list.`}
	/>

	<section class="grid gap-5 md:grid-cols-3">
		<SurfaceCard title="Books on shelf" description="Total entries">
			<p class="font-display text-4xl text-[var(--color-ink)]">{data.summary.totalBooks}</p>
		</SurfaceCard>
		<SurfaceCard title="Currently reading" description="Active reads">
			<p class="font-display text-4xl text-[var(--color-ink)]">{data.summary.readingCount}</p>
		</SurfaceCard>
		<SurfaceCard title="Average rating" description="Out of 5">
			<p class="font-display text-4xl text-[var(--color-ink)]">
				{data.summary.averageRating ?? '—'}
			</p>
		</SurfaceCard>
	</section>

	{#if data.entries.length === 0}
		<EmptyState
			title={`${data.owner.name} has not shelved anything yet.`}
			message="Their shelf will appear here once they add their first book."
		/>
	{:else}
		<section class="space-y-4">
			<h2 class="font-display text-3xl text-[var(--color-ink)]">Books</h2>
			<ul class="grid gap-5 lg:grid-cols-2">
				{#each data.entries as entry (entry.id)}
					<li>
						<article
							aria-label={`${entry.book.title} by ${entry.book.author}`}
							class="grid gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]"
						>
							<div class="flex items-start justify-between gap-4">
								<div>
									<h3 class="font-display text-2xl text-[var(--color-ink)]">{entry.book.title}</h3>
									<p class="mt-1 text-sm font-medium text-[var(--color-muted)]">
										{entry.book.author}
									</p>
								</div>
								<span
									class="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold tracking-[0.16em] text-[var(--color-accent-strong)] uppercase"
								>
									{shelfStatusLabels[entry.status]}
								</span>
							</div>
							{#if entry.book.description}
								<p class="text-sm leading-6 text-[var(--color-muted)]">{entry.book.description}</p>
							{/if}
							<div
								class="flex items-center justify-between gap-3 text-xs text-[var(--color-muted)]"
							>
								<span>Open Library: {entry.book.openLibraryId}</span>
								{#if entry.rating !== null}
									<span class="font-semibold text-[var(--color-ink)]">Rated: {entry.rating}/5</span>
								{/if}
							</div>
						</article>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
