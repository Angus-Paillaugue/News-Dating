<script>
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils';
	import Article from '$lib/components/Article.svelte';
	import Card from '$lib/components/Card.svelte';
	import { CARDS_COLORS, PROXY_URL, FEED_URLS } from '$lib/constants';
	import Spinner from '$lib/components/Spinner.svelte';
	import CircleX from '$lib/components/icons/CircleX.svelte';

	let items = $state([]);
	const { data } = $props();
	let fsArticleProps = $state({ visible: false, url: '', color: '' });
	let bookmarks = $state(data.bookmarks || []);
	let activeSelectItem = $state(Object.keys(FEED_URLS)[0]);
	const maxZIndex = 9999;
	let isLoading = $state(false);
	let error = $state(null);

	async function fetchData() {
		items = [];
		isLoading = true;
		error = null;
		try {
			const response = await fetch(
				`${PROXY_URL}/get?url=${encodeURIComponent(FEED_URLS[activeSelectItem])}`
			);
			const xml = await response.json();
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(xml.contents, 'text/xml');

			const itemsElement = xmlDoc.getElementsByTagName('item');
			Array.from(itemsElement).forEach((item) => {
				try {
					const title = item.getElementsByTagName('title')[0].firstChild.nodeValue;
					const url = item.getElementsByTagName('link')[0].firstChild.nodeValue;
					const description = item.getElementsByTagName('description')[0].firstChild.nodeValue;
					const date = item.getElementsByTagName('pubDate')[0].firstChild.nodeValue;

					const img = item.getElementsByTagName('media:thumbnail')[0].getAttribute('url');

					const bookmark = bookmarks.find((b) => b.url === url);

					items.push({
						title,
						url,
						description,
						date,
						img,
						color: bookmark?.color ?? CARDS_COLORS[Math.floor(Math.random() * CARDS_COLORS.length)]
					});
				} catch (err) {
					console.error('ERROR: ' + err);
					error = err;
				}
			});
		} catch (err) {
			console.error('ERROR: ' + err);
			error = err;
		}

		isLoading = false;
	}

	// TODO: Uncomment this in prod
	onMount(async () => {
		await fetchData();
	});

	$effect(async () => {
		await fetchData();
	});

	function handleTouchStart(event, index) {
		const touch = event.touches[0];
		items[index].startX = touch.clientX;
		items[index].currentX = touch.clientX;
	}

	function handleTouchMove(event, index) {
		const touch = event.touches[0];
		items[index].currentX = touch.clientX;
		const diffX = items[index].currentX - items[index].startX;
		const rotation = diffX / 10; // Adjust the divisor to control the rotation speed
		items[index].transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
	}

	function handleTouchEnd(event, index, article) {
		const diffX = items[index].currentX - items[index].startX;
		if (Math.abs(diffX) > 100) {
			// If swipe right
			if (diffX > 0) {
				fsArticleProps.url = article.url;
				fsArticleProps.visible = true;
				fsArticleProps.color = article.color;
			}
			const duration = window.innerWidth / 2 + 225;
			const endValue = diffX > 0 ? duration : -duration;
			items[index].transitionDuration = duration;
			items[index].transform = `translateX(${endValue}px)`;
			items[index].opacity = 0;
		} else {
			items[index].transform = 'translateX(0) rotate(0)';
		}
	}
</script>

<Article
	url={fsArticleProps.url}
	bind:bookmarks
	bind:color={fsArticleProps.color}
	bind:visible={fsArticleProps.visible}
/>

<div class="h-full grow flex flex-col">
	<div class="shrink-0 p-4 pb-0">
		<div
			class="flex flex-row overflow-x-auto no-scrollbar flex-nowrap gap-4 max-w-md mx-auto w-full"
		>
			{#each Object.keys(FEED_URLS) as category}
				<button
					class={cn(
						'shrink-0 px-4 py-2 rounded-full bg-neutral-800 text-neutral-100 font-bold transition-colors capitalize',
						activeSelectItem === category && 'bg-neutral-100 text-neutral-800'
					)}
					onclick={() => (activeSelectItem = category)}>{category}</button
				>
			{/each}
		</div>
	</div>
	<div class="flex grow flex-col items-center justify-center relative overflow-hidden">
		{#if error}
			<div
				class="px-6 max-w-md mx-auto py-4 rounded-3xl flex flex-row gap-4 text-text-heading items-center"
				style="background-color: #{CARDS_COLORS[0]};"
			>
				<CircleX class="size-6 shrink-0 text-red-600" />
				<h1 class="text-xl font-medium text-inherit">{error}</h1>
			</div>
		{:else if isLoading}
			<Spinner class="size-8" />
		{:else}
			{#each items as article, i}
				<div
					class="absolute inset-4 mx-auto rounded-3xl overflow-hidden max-w-md max-h-[700px] trconsole.logsition-all"
					style="z-index: {maxZIndex - i}; transform: {article.transform ||
						'translateX(0) rotate(0)'}; transition-duration: {article.transitionDuration ??
						'75'}ms; opacity: {article.opacity ?? 1};"
					ontouchstart={(event) => handleTouchStart(event, i)}
					ontouchmove={(event) => handleTouchMove(event, i)}
					ontouchend={(event) => handleTouchEnd(event, i, article)}
				>
					<Card {article} />
				</div>
			{/each}
		{/if}
	</div>
</div>
