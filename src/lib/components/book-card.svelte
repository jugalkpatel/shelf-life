<script lang="ts">
	import type { StarterBook } from '$lib/sample-books';
	import { shelfStatusLabels } from '$lib/shelf';

	let { book }: { book: StarterBook } = $props();
</script>

<article
	aria-label={`${book.title} by ${book.author}`}
	data-book-card
	class="flex h-full flex-col gap-4 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)"
>
	<h3 class="font-display text-2xl text-(--color-ink)">{book.title}</h3>

	<p class="text-sm leading-6 text-(--color-muted)">{book.description}</p>

	<div class="mt-auto space-y-4">
		<div data-book-card-meta class="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
			<p class="min-w-0 text-sm font-medium text-(--color-ink)">{book.author}</p>
			{#if book.status}
				<span
					class="rounded-full border border-(--color-border-strong) bg-(--color-surface-soft) px-3 py-1 text-xs font-semibold tracking-[0.16em] text-(--color-accent-strong) uppercase"
				>
					{shelfStatusLabels[book.status]}
				</span>
			{/if}
		</div>

		<div
			data-book-card-footer
			class="grid min-h-9 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-xs text-(--color-muted)"
		>
			<span class="min-w-0 truncate">Open Library: {book.openLibraryId}</span>
			{#if book.rating !== undefined && book.rating !== null}
				<span
					class="rounded-full bg-(--color-surface-soft) px-3 py-1 font-semibold text-(--color-ink)"
				>
					Rated {book.rating}/5
				</span>
			{/if}
		</div>
	</div>
</article>
