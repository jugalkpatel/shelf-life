<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import EmptyState from '$lib/components/empty-state.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import RateBookDialog from '$lib/components/rate-book-dialog.svelte';
	import SurfaceCard from '$lib/components/surface-card.svelte';
	import { shelfStatusLabels } from '$lib/shelf';
	import type { PageData } from './$types';

	type ShelfEntryView = PageData['entries'][number];

	let { data }: { data: PageData } = $props();

	let rateTarget = $state<ShelfEntryView | null>(null);
	let feedbackMessage = $state<{ tone: 'success' | 'error'; text: string } | null>(null);

	const openRatingDialog = (entry: ShelfEntryView) => {
		rateTarget = entry;
	};

	const handleRatingSubmitted = async (entryId: string, rating: number) => {
		feedbackMessage = null;
		try {
			const response = await fetch(`/api/shelf/${entryId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ rating })
			});
			if (!response.ok) {
				const body = (await response.json().catch(() => ({}))) as { error?: string };
				feedbackMessage = {
					tone: 'error',
					text: body.error ?? 'We could not save that rating.'
				};
				return;
			}
			feedbackMessage = {
				tone: 'success',
				text: `Thanks! Rating saved for ${rateTarget?.book.title ?? 'this book'}.`
			};
			await invalidateAll();
		} catch {
			feedbackMessage = { tone: 'error', text: 'Network error while saving the rating.' };
		} finally {
			rateTarget = null;
		}
	};
</script>

<div class="space-y-8">
	<PageHeader
		eyebrow="Protected app surface"
		title={`${data.user?.name ?? 'Your'} shelf`}
		description="Your reading list, with status and ratings."
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

	{#if feedbackMessage}
		<div
			role="status"
			aria-live="polite"
			class={[
				'rounded-2xl border px-4 py-3 text-sm',
				feedbackMessage.tone === 'success'
					? 'border-green-200 bg-green-50 text-green-800'
					: 'border-red-200 bg-red-50 text-red-700'
			]}
		>
			{feedbackMessage.text}
		</div>
	{/if}

	{#if data.entries.length === 0}
		<EmptyState
			title="Your shelf is empty."
			message="Find a book to add to your reading list."
			actionLabel="Open search"
			actionHref="/search"
		/>
	{:else}
		<section class="space-y-4">
			<h2 class="font-display text-3xl text-[var(--color-ink)]">Your books</h2>
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
							<div class="flex flex-wrap items-center justify-between gap-3">
								<span class="text-xs text-[var(--color-muted)]">
									Open Library: {entry.book.openLibraryId}
								</span>
								<div class="flex items-center gap-3">
									{#if entry.rating !== null}
										<span class="text-sm font-semibold text-[var(--color-ink)]">
											Rated: {entry.rating}/5
										</span>
									{/if}
									<button
										type="button"
										class="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
										onclick={() => openRatingDialog(entry)}
									>
										Rate this book
									</button>
								</div>
							</div>
						</article>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>

{#if rateTarget}
	<RateBookDialog
		entry={rateTarget}
		oncancel={() => (rateTarget = null)}
		onsubmit={(rating) => handleRatingSubmitted(rateTarget!.id, rating)}
	/>
{/if}
