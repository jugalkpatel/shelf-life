<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		label,
		name,
		type = 'text',
		value = '',
		placeholder = '',
		required = false,
		autocomplete,
		hint,
		disabled = false
	}: {
		label: string;
		name: string;
		type?: HTMLInputAttributes['type'];
		value?: string;
		placeholder?: string;
		required?: boolean;
		autocomplete?: HTMLInputAttributes['autocomplete'];
		hint?: string;
		disabled?: boolean;
	} = $props();

	const inputId = $props.id();
	const describedBy = $derived(hint ? `${inputId}-hint` : undefined);
</script>

<label class="grid gap-2 text-sm font-medium text-(--color-ink)" for={inputId}>
	<span>{label}</span>
	<input
		class="w-full appearance-none rounded-(--radius-control) border border-(--color-border) bg-(--color-surface) px-4 py-3 text-sm text-(--color-ink) placeholder:text-(--color-muted) focus:border-(--color-border-strong) focus:ring-(--color-border-strong) disabled:text-(--color-muted) disabled:opacity-100"
		id={inputId}
		{name}
		{type}
		{placeholder}
		{required}
		{autocomplete}
		{disabled}
		aria-describedby={describedBy}
		{value}
	/>
	{#if hint}
		<span id={describedBy} class="text-xs font-normal text-(--color-muted)">{hint}</span>
	{/if}
</label>
