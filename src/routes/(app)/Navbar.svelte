<script>
	import { page } from '$app/stores';
	import { bionicReadingEnabled } from '$lib/stores';
	import { cn } from '$lib/utils';
	import HomeFill from '$lib/components/icons/HomeFill.svelte';
	import HomeBorder from '$lib/components/icons/HomeBorder.svelte';
	import BookmarkFill from '$lib/components/icons/BookmarkFill.svelte';
	import BookmarkBorder from '$lib/components/icons/BookmarkBorder.svelte';

	let activeNavLink = $state();

	page.subscribe((value) => {
		if (value.url.pathname === '/') {
			activeNavLink = 'home';
		} else if (value.url.pathname.startsWith('/bookmarks')) {
			activeNavLink = 'bookmarks';
		}
	});
</script>

<div class="flex flex-row items-center justify-center p-5 fixed bottom-0 left-0 right-0 z-[10001]">
	<div class="flex flex-row gap-2 rounded-full p-2 relative">
		<img src="/navBg.svg" alt="" class="absolute inset-0 -z-10" />
		<a
			href="/"
			class={cn(
				'size-14 rounded-full bg-neutral-600/50 text-neutral-100 p-2',
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
				'size-14 rounded-full bg-neutral-600/50 text-neutral-100 p-2 flex flex-col items-center justify-center',
				$bionicReadingEnabled && 'bg-neutral-100 text-neutral-800'
			)}
			aria-label="Search"
		>
			<h1 class="text-inherit text-4xl font-bold">Br</h1>
		</button>
		<a
			href="/bookmarks"
			class={cn(
				'size-14 rounded-full bg-neutral-600/50 text-neutral-100 p-2',
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
