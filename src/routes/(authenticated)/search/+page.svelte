<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/button.svelte';
	import EmptyState from '$lib/components/empty-state.svelte';
	import Input from '$lib/components/input.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import SurfaceCard from '$lib/components/surface-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let pendingOpenLibraryId = $state<string | null>(null);
	let feedbackMessage = $state<{ tone: 'success' | 'error'; text: string } | null>(null);

	const handleAddToShelf = async (
		openLibraryId: string,
		title: string,
		author: string,
		description: string | null
	) => {
		pendingOpenLibraryId = openLibraryId;
		feedbackMessage = null;
		try {
			const response = await fetch('/api/shelf', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ openLibraryId, title, author, description, status: 'to-read' })
			});
			if (!response.ok) {
				const body = (await response.json().catch(() => ({}))) as { error?: string };
				feedbackMessage = {
					tone: 'error',
					text: body.error ?? 'We could not add that book to your shelf.'
				};
				return;
			}
			feedbackMessage = { tone: 'success', text: `Added ${title} to your shelf.` };
			await invalidateAll();
		} catch {
			feedbackMessage = { tone: 'error', text: 'Network error while adding to shelf.' };
		} finally {
			pendingOpenLibraryId = null;
		}
	};
</script>

<div class="space-y-8">
	<PageHeader
		eyebrow="Protected app surface"
		title="Search the library."
		description="Search is backed by the Open Library API. Results can be added to your shelf with one click."
	/>

	<SurfaceCard title="Find a book" description="Search by title, author, or ISBN.">
		<form class="grid gap-4 md:grid-cols-[1fr_auto]" method="GET">
			<Input
				label="Search by title, author, or ISBN"
				name="query"
				value={data.query}
				placeholder="Try Station Eleven or Susanna Clarke"
			/>
			<div class="self-end">
				<Button type="submit">Search</Button>
			</div>
		</form>
	</SurfaceCard>

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

	{#if !data.query}
		<EmptyState
			title="Ready when you are."
			message="Type a title or author and we'll look it up in the Open Library catalog."
		/>
	{:else if data.results.length === 0}
		<EmptyState
			title="No matches"
			message={`We could not find anything matching “${data.query}”. Try another query.`}
		/>
	{:else}
		<section class="space-y-4">
			<div class="flex items-center justify-between gap-3">
				<h2 class="font-display text-3xl text-(--color-ink)">Search results</h2>
				<p class="text-sm text-(--color-muted)">
					{data.results.length} result{data.results.length === 1 ? '' : 's'}
				</p>
			</div>

			<ul class="space-y-5">
				{#each data.results as result (result.openLibraryId)}
					<li>
						<article
							aria-label={`${result.title} by ${result.author}`}
							class="grid gap-4 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)"
						>
							<div>
								<h3 class="font-display text-2xl text-(--color-ink)">{result.title}</h3>
								<p class="mt-1 text-sm font-medium text-(--color-muted)">{result.author}</p>
								{#if result.publishedYear}
									<p class="text-xs text-(--color-muted)">
										First published {result.publishedYear}
									</p>
								{/if}
							</div>
							{#if result.description}
								<p class="text-sm leading-6 text-(--color-muted)">{result.description}</p>
							{/if}
							<div
								class="flex flex-wrap items-center justify-between gap-3 text-xs text-(--color-muted)"
							>
								<span>Open Library: {result.openLibraryId}</span>
								{#if result.onShelf}
									<span class="font-semibold text-(--color-accent-strong)"
										>Already on your shelf</span
									>
								{:else}
									<Button
										type="button"
										disabled={pendingOpenLibraryId === result.openLibraryId}
										onclick={() =>
											handleAddToShelf(
												result.openLibraryId,
												result.title,
												result.author,
												result.description
											)}
									>
										{pendingOpenLibraryId === result.openLibraryId ? 'Adding…' : 'Add to shelf'}
									</Button>
								{/if}
							</div>
						</article>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
