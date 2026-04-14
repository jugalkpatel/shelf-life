<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/button.svelte';
	import Input from '$lib/components/input.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import SurfaceCard from '$lib/components/surface-card.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const progressLabel = $derived(
		data.progress.targetBooks === null
			? "You haven't set a reading goal for this year yet."
			: `You've read ${data.progress.finishedBooks} of ${data.progress.targetBooks} books this year.`
	);

	const progressBarColor = $derived(data.progress.goalMet ? 'bg-green-500' : 'bg-(--color-accent)');
</script>

<div class="space-y-8">
	<PageHeader
		eyebrow="Reading goals"
		title={`Your ${data.progress.year} reading goal`}
		description="Set an annual target and track how close you are to meeting it."
	/>

	<section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
		<SurfaceCard
			title="This year's progress"
			description={`Finished books in ${data.progress.year} count toward your goal.`}
		>
			<div class="space-y-4">
				<p class="font-display text-3xl text-(--color-ink)" aria-label="Reading progress summary">
					{progressLabel}
				</p>

				{#if data.progress.targetBooks !== null}
					<div
						class="h-3 w-full overflow-hidden rounded-full bg-(--color-surface-soft)"
						role="progressbar"
						aria-valuenow={data.progress.percentage}
						aria-valuemin="0"
						aria-valuemax="100"
						aria-label={`${data.progress.percentage} percent of annual reading goal met`}
					>
						<div
							class={`h-full ${progressBarColor} transition-all`}
							style:width={`${data.progress.percentage}%`}
						></div>
					</div>
					<p class="text-sm text-(--color-muted)">
						{data.progress.percentage}% of the way there.
					</p>
				{/if}

				{#if data.progress.goalMet}
					<p
						role="status"
						aria-live="polite"
						class="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800"
					>
						You did it! Goal met for {data.progress.year}.
					</p>
				{/if}
			</div>
		</SurfaceCard>

		<SurfaceCard
			title="Set your annual goal"
			description="Change your target for the year. Only whole numbers between 1 and 999."
		>
			<form method="POST" action="?/setGoal" class="space-y-4" use:enhance>
				<Input
					label="Target books for the year"
					name="targetBooks"
					type="number"
					value={String(data.progress.targetBooks ?? '')}
					hint="Saving this overwrites any previous target for this year."
				/>
				{#if form?.message}
					<p class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{form.message}
					</p>
				{/if}
				{#if form?.savedAt}
					<p
						role="status"
						aria-live="polite"
						class="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
					>
						Saved your {data.progress.year} goal.
					</p>
				{/if}
				<Button type="submit">Save goal</Button>
			</form>
		</SurfaceCard>
	</section>
</div>
