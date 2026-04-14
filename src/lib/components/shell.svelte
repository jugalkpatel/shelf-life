<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';
	import Button from './button.svelte';

	type CurrentUser = {
		name: string;
		email: string;
	} | null;

	let {
		currentPath,
		currentUser,
		children
	}: {
		currentPath: string;
		currentUser: CurrentUser;
		children: Snippet;
	} = $props();

	const baseLinkClasses =
		'rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium transition';
	const activeLinkClasses = 'bg-[var(--color-surface-soft)] text-[var(--color-ink)]';
	const inactiveLinkClasses =
		'text-[var(--color-muted)] hover:bg-white/60 hover:text-[var(--color-ink)]';

	const isCurrentPath = (href: string) =>
		currentPath === href || currentPath.startsWith(`${href}/`);
</script>

<div class="min-h-screen">
	<header
		class="sticky top-0 z-10 border-b border-(--color-border) bg-[rgba(246,241,231,0.9)] backdrop-blur"
	>
		<div
			class="mx-auto flex w-full max-w-(--page-width) items-center justify-between gap-4 px-(--page-gutter) py-4"
		>
			<div class="flex items-center gap-6">
				<a href={resolve('/')} class="font-display text-2xl font-semibold text-(--color-ink)">
					Shelf
				</a>
				<nav class="hidden items-center gap-1 md:flex" aria-label="Primary">
					<a
						class={[baseLinkClasses, isCurrentPath('/') ? activeLinkClasses : inactiveLinkClasses]}
						href={resolve('/')}>Home</a
					>
					<a
						class={[
							baseLinkClasses,
							isCurrentPath('/search') ? activeLinkClasses : inactiveLinkClasses
						]}
						href={resolve('/search')}
					>
						Search
					</a>
					<a
						class={[
							baseLinkClasses,
							isCurrentPath('/design-system') ? activeLinkClasses : inactiveLinkClasses
						]}
						href={resolve('/design-system')}
					>
						Design system
					</a>
					<a
						class={[
							baseLinkClasses,
							isCurrentPath('/playground') ? activeLinkClasses : inactiveLinkClasses
						]}
						href={resolve('/playground')}
					>
						Playground
					</a>
					{#if currentUser}
						<a
							class={[
								baseLinkClasses,
								isCurrentPath('/shelf') ? activeLinkClasses : inactiveLinkClasses
							]}
							href={resolve('/shelf')}
						>
							Shelf
						</a>
						<a
							class={[
								baseLinkClasses,
								isCurrentPath('/goals') ? activeLinkClasses : inactiveLinkClasses
							]}
							href={resolve('/goals')}
						>
							Goals
						</a>
					{/if}
				</nav>
			</div>

			<div class="flex items-center gap-3">
				{#if currentUser}
					<div class="hidden text-right sm:block">
						<p class="text-sm font-semibold text-(--color-ink)">{currentUser.name}</p>
						<p class="text-xs text-(--color-muted)">{currentUser.email}</p>
					</div>
					<form method="POST" action="/logout">
						<Button type="submit" kind="secondary">Sign out</Button>
					</form>
				{:else}
					<Button href="/login">Sign in</Button>
				{/if}
			</div>
		</div>
	</header>

	<main class="mx-auto w-full max-w-(--page-width) px-(--page-gutter) py-10 md:py-14">
		{@render children()}
	</main>
</div>
