<script>
	import { page } from '$app/stores';
	import { bionicReadingEnabled, showNavbar } from '$lib/stores';
	import { cn } from '$lib/utils';
	import HomeFill from '$lib/components/icons/HomeFill.svelte';
	import HomeBorder from '$lib/components/icons/HomeBorder.svelte';
	import BookmarkFill from '$lib/components/icons/BookmarkFill.svelte';
	import BookmarkBorder from '$lib/components/icons/BookmarkBorder.svelte';
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';

	let activeNavLink = $state();

	page.subscribe((value) => {
		if (value.url.pathname === '/') {
			activeNavLink = 'home';
		} else if (value.url.pathname.startsWith('/bookmarks')) {
			activeNavLink = 'bookmarks';
		}
	});
</script>

{#if $showNavbar}
	<div
		class="fixed bottom-2 sm:bottom-5 left-1/2 -translate-x-1/2 z-[10001]"
		transition:fly={{ y: '92px', duration: 600, opacity: 1, easing: backInOut }}
	>
		<div class="flex flex-row gap-2 p-2 relative">
			<img src="/navBg.svg" alt="" class="absolute inset-0 -z-10" />
			<a
				href="/"
				class={cn(
					'size-14 rounded-full bg-neutral-600/50 text-text-heading-dark p-2',
					activeNavLink === 'home' && 'bg-neutral-100 text-neutral-800'
				)}
				aria-label="Home"
			>
				{#if activeNavLink === 'home'}
					<HomeFill class="size-full" />
				{:else}
					<HomeBorder class="size-full" />
				{/if}
			</a>
			<button
				onclick={() => {
					$bionicReadingEnabled = !$bionicReadingEnabled;
				}}
				class={cn(
					'size-14 rounded-full bg-neutral-600/50 text-text-heading-dark p-2 flex flex-col items-center justify-center',
					$bionicReadingEnabled && 'bg-neutral-100 text-neutral-800'
				)}
				aria-label="Search"
			>
				<h1 class="text-inherit text-4xl font-bold">Br</h1>
			</button>
			<a
				href="/bookmarks"
				class={cn(
					'size-14 rounded-full bg-neutral-600/50 text-text-heading-dark p-2',
					activeNavLink === 'bookmarks' && 'bg-neutral-100 text-neutral-800'
				)}
				aria-label="Bookmarks"
			>
				{#if activeNavLink === 'bookmarks'}
					<BookmarkFill class="size-full" />
				{:else}
					<BookmarkBorder class="size-full" />
				{/if}
			</a>
		</div>
	</div>
{/if}
