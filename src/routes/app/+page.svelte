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
	let activeCategoryIndex = $state(0);
	let activeProviderIndex = $state(0);
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

		const provider = allCategories[activeProviderIndex];
		const category = provider.categories[activeCategoryIndex];

		try {
			const response = await fetch(`${PROXY_URL}/get?url=${encodeURIComponent(category.url)}`);
			const xml = await response.json();
			if (xml.status.http_code !== 200) {
				error = 'An error occurred while fetching the news';
			}
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(xml.contents, 'text/xml');
			const itemsElement = xmlDoc.getElementsByTagName('item');

			Array.from(itemsElement).forEach((item, index) => {
				try {
					// Use the dynamic selectors to extract the data
					const title = stripHtml(
						item.getElementsByTagName(provider.titleSelector)[0]?.firstChild.nodeValue
					);
					const url = item.getElementsByTagName(provider.urlSelector)[0]?.firstChild.nodeValue;
					const description = stripHtml(
						item.getElementsByTagName(provider.descriptionSelector)[0]?.firstChild.nodeValue
					);
					const date = item.getElementsByTagName(provider.dateSelector)[0]?.firstChild.nodeValue;
					const img = item.getElementsByTagName(provider.imgSelector)[0]?.getAttribute('url');

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

	function stripHtml(html) {
		let tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	}

	function handleTouchStart(event) {
		const index = activeCardIndex;
		const touch = (event?.touches && event?.touches[0]) ?? { clientX: event.clientX };
		items[index].startX = touch.clientX;
		items[index].currentX = touch.clientX;
	}

	function handleTouchMove(event) {
		const index = activeCardIndex;
		if (!items[index]?.startX) return;

		const touch = (event?.touches && event?.touches[0]) ?? { clientX: event.clientX };
		items[index].currentX = touch.clientX;
		const diffX = items[index].currentX - items[index].startX;
		const rotation = diffX / CARD_ROTATION_FACTOR;
		items[index].transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
	}

	function handleTouchEnd(event) {
		const index = activeCardIndex;
		if (!items[index]?.startX) return;

		const diffX = items[index].currentX - items[index].startX;
		if (Math.abs(diffX) > event.target.clientWidth / 4) {
			// If swipe right
			if (diffX > 0) {
				fsArticleProps.url = items[activeCardIndex].url;
				fsArticleProps.visible = true;
				fsArticleProps.color = items[activeCardIndex].color;
			}
			const duration = window.innerWidth / 2 + 225;
			const endValue = diffX > 0 ? duration : -duration;
			const rotation = endValue / CARD_ROTATION_FACTOR;
			items[index].transitionDuration = duration;
			items[index].transform = `translateX(${endValue}px) rotate(${rotation}deg)`;
			items[index].opacity = 0;
			activeCardIndex = index + 1;
		} else {
			items[index].transform = 'translateX(0) rotate(0)';
		}
		items[index].startX = null;
	}
</script>

<svelte:head>
	<title>News</title>
</svelte:head>

<svelte:window onmousemove={handleTouchMove} />

<InterestPicker
	bind:visible={interestPickerVisible}
	bind:categories
	{allCategories}
	onchange={() => {
		activeCategoryIndex = 0;
		fetchData();
	}}
/>

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
				<Dropdown.Trigger class="rounded-full border border-neutral-500/50 p-1.5">
					<GridBorder class="size-6 text-text-heading-dark" />
				</Dropdown.Trigger>
				{#snippet items()}
					<Dropdown.Item
						onclick={() => {
							interestPickerVisible = true;
						}}>Categories</Dropdown.Item
					>
					<Dropdown.Item href="/app/dashboard">Account</Dropdown.Item>
				{/snippet}
			</Dropdown>
		</div>

		<!-- Providers list -->
		<div
			class="flex flex-row overflow-x-auto no-scrollbar flex-nowrap gap-8 mt-8"
			style="z-index: {maxZIndex};"
		>
			{#each categories as provider, i}
				<button
					class={cn(
						'shrink-0 font-medium transition-[font-size] capitalize text-text-body-dark',
						activeProviderIndex === i && 'text-2xl font-semibold text-text-heading-dark'
					)}
					onclick={() => (activeProviderIndex = i)}>{provider.name}</button
				>
			{/each}
		</div>

		<!-- Categories list -->
		<div
			class="flex flex-row overflow-x-auto no-scrollbar flex-nowrap gap-8 mt-2"
			style="z-index: {maxZIndex};"
		>
			{#each categories[activeProviderIndex].categories as category, i}
				<button
					class={cn(
						'shrink-0 font-medium transition-[font-size] capitalize text-text-body-dark',
						activeCategoryIndex === i && 'text-2xl font-semibold text-text-heading-dark'
					)}
					onclick={() => (activeCategoryIndex = i)}>{category.label}</button
				>
			{/each}
		</div>
	</div>

	<!-- Main content -->
	<div class="flex grow flex-col items-center justify-center relative">
		{#if isLoading}
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
						activeCategoryIndex = (activeCategoryIndex + 1) % categories.length;
					}}
				>
					Change category
				</Button>
			</div>
		{:else if items.length > 0}
			<!-- Display news cards -->
			{#each items as article, i}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="absolute top-0 left-4 right-4 bottom-4 mx-auto rounded-3xl overflow-hidden max-w-md max-h-[700px] transition-all"
					style="z-index: {maxZIndex - i - 1}; transform: {article.transform ||
						'translateX(0) rotate(0)'}; transition-duration: {article.transitionDuration ??
						'75'}ms; opacity: {article.opacity ?? 1};"
					ontouchstart={handleTouchStart}
					ontouchmove={handleTouchMove}
					ontouchend={handleTouchEnd}
					onmousedown={handleTouchStart}
					onmouseup={handleTouchEnd}
					onmouseleave={handleTouchEnd}
				>
					<Card {article} />
				</div>
			{/each}
		{:else if error}
			<!-- If any error was thrown during the fetching process -->
			<div
				class="px-6 max-w-md mx-auto py-4 rounded-3xl flex flex-row gap-4 text-text-heading items-center"
				style="background-color: #{CARDS_COLORS[0]};"
			>
				<CircleX class="size-6 shrink-0 text-red-600" />
				<h1 class="text-xl font-medium text-inherit">{error}</h1>
			</div>
		{/if}
	</div>
</div>
