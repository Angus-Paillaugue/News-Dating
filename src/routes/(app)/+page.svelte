<script>
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils';
	import { Card, Spinner, Article } from '$lib/components';
	import { CARDS_COLORS, PROXY_URL } from '$lib/constants';
	import { CircleX, GridBorder } from '$lib/components/icons';
	import InterestPicker from './InterestPicker.svelte';
	import { Button, Dropdown } from '$lib/components';

	let items = $state([]);
	const { data } = $props();
	let fsArticleProps = $state({ visible: false, url: '', color: '' });
	let bookmarks = $state(data.bookmarks || []);
	let categories = $state(data.categories || []);
	const { allCategories } = data;
	let activeSelectItem = $state(0);
	const maxZIndex = 9999;
	let isLoading = $state(false);
	let interestPickerVisible = $state(false);
	let error = $state(null);
	let activeCardIndex = $state(null);
	const CARD_ROTATION_FACTOR = 6;

	async function fetchData() {
		if (!categories.length) return;
		items = [];
		isLoading = true;
		error = null;
		try {
			const response = await fetch(
				`${PROXY_URL}/get?url=${encodeURIComponent(categories[activeSelectItem].url)}`
			);
			const xml = await response.json();
			const parser = new DOMParser();

			const xmlDoc = parser.parseFromString(xml.contents, 'text/xml');

			const itemsElement = xmlDoc.getElementsByTagName('item');
			Array.from(itemsElement).forEach((item, index) => {
				try {
					const title = item.getElementsByTagName('title')[0].firstChild.nodeValue;
					const url = item.getElementsByTagName('link')[0].firstChild.nodeValue;
					const description = item.getElementsByTagName('description')[0].firstChild.nodeValue;
					const date = item.getElementsByTagName('pubDate')[0].firstChild.nodeValue;
					let img = item.getElementsByTagName('media:content')[0]?.getAttribute('url');
					if (!img) {
						img = item.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url');
					}

					const bookmark = bookmarks.find((b) => b.url === url);

					items.push({
						title,
						url,
						description,
						date,
						img,
						color: bookmark?.color ?? CARDS_COLORS[index % CARDS_COLORS.length]
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
		activeCardIndex = 0;
	}

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
		const rotation = diffX / CARD_ROTATION_FACTOR;
		items[index].transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
	}

	function handleTouchEnd(event, index, article) {
		const diffX = items[index].currentX - items[index].startX;
		if (Math.abs(diffX) > event.target.clientWidth / 4) {
			// If swipe right
			if (diffX > 0) {
				fsArticleProps.url = article.url;
				fsArticleProps.visible = true;
				fsArticleProps.color = article.color;
			}
			const duration = window.innerWidth / 2 + 225;
			const endValue = diffX > 0 ? duration : -duration;
			const rotation = endValue / CARD_ROTATION_FACTOR;
			items[index].transitionDuration = duration;
			items[index].transform = `translateX(${endValue}px) rotate(${rotation}deg)`;
			items[index].opacity = 0;
			activeCardIndex = index;
		} else {
			items[index].transform = 'translateX(0) rotate(0)';
		}
	}
</script>

<svelte:head>
	<title>News</title>
</svelte:head>

<InterestPicker bind:visible={interestPickerVisible} bind:categories {allCategories} />

<Article
	url={fsArticleProps.url}
	bind:bookmarks
	bind:color={fsArticleProps.color}
	bind:visible={fsArticleProps.visible}
/>

<div class="h-full grow flex flex-col pb-[4.5rem] sm:pb-28 overflow-hidden">
	<!-- Heading -->
	<div class="shrink-0 p-4 max-w-md mx-auto w-full">
		<div class="flex flex-row justify-between items-center">
			<h1 class="text-xl font-extrabold">News</h1>
			<!-- Open categories modal button -->
			<Dropdown align="end">
				<Dropdown.Trigger class="rounded-full border border-neutral-500/50 p-1">
					<GridBorder class="size-6 text-text-heading-dark" />
				</Dropdown.Trigger>
				{#snippet items()}
					<Dropdown.Item
						onclick={() => {
							interestPickerVisible = true;
						}}>Categories</Dropdown.Item
					>
					<Dropdown.Item href="/dashboard">Account</Dropdown.Item>
				{/snippet}
			</Dropdown>
		</div>

		<!-- Categories list -->
		<div
			class="flex flex-row overflow-x-auto no-scrollbar flex-nowrap gap-8 mt-8"
			style="z-index: {maxZIndex};"
		>
			{#each categories as category, i}
				<button
					class={cn(
						'shrink-0 font-medium transition-[font-size] capitalize text-text-body-dark',
						activeSelectItem === i && 'text-2xl font-semibold text-text-heading-dark'
					)}
					onclick={() => (activeSelectItem = i)}>{category.label}</button
				>
			{/each}
		</div>
	</div>

	<!-- Main content -->
	<div class="flex grow flex-col items-center justify-center relative">
		<!-- If any error was thrown during the fetching process -->
		{#if error}
			<div
				class="px-6 max-w-md mx-auto py-4 rounded-3xl flex flex-row gap-4 text-text-heading items-center"
				style="background-color: #{CARDS_COLORS[0]};"
			>
				<CircleX class="size-6 shrink-0 text-red-600" />
				<h1 class="text-xl font-medium text-inherit">{error}</h1>
			</div>
		{:else if isLoading}
			<!-- If is fetching news and parsing them -->
			<Spinner class="size-8" />
		{:else if activeCardIndex === items.length - 1}
			<!-- If there are no more news card to display -->
			<div
				class="px-6 max-w-md mx-auto py-4 rounded-3xl flex flex-col gap-4 text-text-heading items-center"
				style="background-color: #{CARDS_COLORS[0]};"
			>
				<h1 class="text-xl font-medium text-inherit">You reached the end !</h1>
				<Button
					onclick={() => {
						activeSelectItem = (activeSelectItem + 1) % categories.length;
					}}
				>
					Change category
				</Button>
			</div>
		{:else}
			<!-- Display news cards -->
			{#each items as article, i}
				<div
					class="absolute top-0 left-4 right-4 bottom-4 mx-auto rounded-3xl overflow-hidden max-w-md max-h-[700px] trconsole.logsition-all"
					style="z-index: {maxZIndex - i - 1}; transform: {article.transform ||
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
