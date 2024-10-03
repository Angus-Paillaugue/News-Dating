<script>
	import Card from '$lib/components/Card.svelte';
	import Article from '$lib/components/Article.svelte';
	import { CARDS_COLORS } from '$lib/constants';
	import CircleSlash from '$lib/components/icons/CircleSlash.svelte';
	import Fuse from 'fuse.js';

	const { data } = $props();
	let bookmarks = $state(data.bookmarks || []);
	let searchInputValue = $state('');

	let fsArticleProps = $state({ visible: false, url: '', color: '' });
	let bookmarksMatchingSearch = $state([]);

	const fuseOptionsList = {
		threshold: 0.4,
		ignoreLocation: true,
		keys: ['title', 'description']
	};

	const fuseList = new Fuse(
		// svelte-ignore state_referenced_locally
		bookmarks,
		fuseOptionsList
	);

	$effect(() => {
		fuseList.setCollection(bookmarks);
	});

	$effect(() => {
		if (searchInputValue === '') {
			bookmarksMatchingSearch = bookmarks;
			return;
		}

		bookmarksMatchingSearch = fuseList.search(searchInputValue).map((result) => result.item);
	});
</script>

<svelte:head>
  <title>Bookmarks</title>
</svelte:head>

<Article
	url={fsArticleProps.url}
	bind:bookmarks
	bind:color={fsArticleProps.color}
	bind:visible={fsArticleProps.visible}
	onBookmarkChange={() => {
		fsArticleProps.visible = false;
	}}
/>

<div class="h-screen relative overflow-hidden flex flex-col">
	<div class="max-w-md mx-auto w-full p-4">
		<h1 class="mb-4 text-3xl font-bold">Your bookmarks</h1>
		<input
			type="text"
			class="px-4 py-2 text-lg font-medium rounded-full bg-neutral-800 w-full text-text-heading-dark placeholder:text-text-body focus:outline-0 outline-0"
			placeholder="Search news"
			bind:value={searchInputValue}
		/>
	</div>
	<div
		class="flex grow flex-col gap-8 items-center p-5 justify-start no-scrollbar overflow-y-auto pb-28"
	>
		{#if bookmarks.length === 0}
			<div
				class="px-6 py-4 rounded-3xl flex flex-row gap-4 text-text-heading items-center"
				style="background-color: #{CARDS_COLORS[0]};"
			>
				<CircleSlash class="size-6" />
				<h1 class="text-2xl font-bold text-inherit">No bookmarks yet</h1>
			</div>
		{/if}
		{#each bookmarksMatchingSearch as article, i}
			<button
				onclick={() => {
					fsArticleProps.url = article.url;
					fsArticleProps.visible = true;
					fsArticleProps.color = article.color;
				}}
				class="rounded-3xl text-start"
				style="transform-origin: 50% 100%; transform: rotate({(i % 2 > 0 && '-') +
					Math.round(Math.random() * 2 + 1)}deg);"
			>
				<Card {article} />
			</button>
		{/each}
	</div>
</div>
