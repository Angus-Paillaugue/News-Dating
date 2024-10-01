<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { bionicReadingEnabled } from '$lib/stores';
	import { browser } from '$app/environment';
	import Home from '$lib/components/icons/Home.svelte';
	import BookmarkFull from '$lib/components/icons/BookmarkFull.svelte';

	const { children } = $props();
	let activeNavLink = $state();

	page.subscribe((value) => {
		if (value.route.id === '/') {
			activeNavLink = 'home';
		} else if (value.route.id?.startsWith('/bookmarks')) {
			activeNavLink = 'bookmarks';
		}
	});

	bionicReadingEnabled.subscribe((value) => {
		if (!browser) return;
		document.body.style.setProperty('--br-weight', value ? '900' : 'inherit');
	});
</script>

<div class="min-h-screen flex flex-col">
	<div class="grow flex flex-col">
		{@render children()}
	</div>

	<div class="h-24"></div>
	<div
		class="flex flex-row items-center justify-center p-4 fixed bottom-0 left-0 right-0 z-[10001]"
	>
		<div class="flex flex-row gap-4 rounded-full p-2 bg-neutral-900">
			<a
				href="/"
				class={cn(
					'size-14 rounded-full bg-neutral-800 text-neutral-100 p-2 transition-colors',
					activeNavLink === 'home' && 'bg-neutral-100 text-neutral-800'
				)}
				aria-label="Home"
			>
				<Home class="size-full" />
			</a>
			<button
				onclick={() => {
					$bionicReadingEnabled = !$bionicReadingEnabled;
				}}
				class={cn(
					'size-14 rounded-full bg-neutral-800 text-neutral-100 p-2 transition-colors flex flex-col items-center justify-center',
					$bionicReadingEnabled && 'bg-neutral-100 text-neutral-800'
				)}
				aria-label="Search"
			>
				<h1 class="transition-colors text-inherit text-4xl font-bold">Br</h1>
			</button>
			<a
				href="/bookmarks"
				class={cn(
					'size-14 rounded-full bg-neutral-800 text-neutral-100 p-2 transition-colors',
					activeNavLink === 'bookmarks' && 'bg-neutral-100 text-neutral-800'
				)}
				aria-label="Bookmarks"
			>
				<BookmarkFull class="size-full" />
			</a>
		</div>
	</div>
</div>
