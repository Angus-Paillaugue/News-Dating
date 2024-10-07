<script>
	import { onMount } from 'svelte';
	import { Card, Spinner, Article } from '$lib/components';
	import { CARDS_COLORS, PROXY_URL } from '$lib/constants';
	import { CircleX, GridBorder, Swap } from '$lib/components/icons';
	import InterestPicker from './InterestPicker.svelte';
	import ChangeCategory from './ChangeCategory.svelte';
	import { Button, Dropdown } from '$lib/components';
	import { browser } from '$app/environment';

	const { data } = $props();
	const { allCategories } = data;
	const MAX_Z_INDEX = 9999;
	const CARD_ROTATION_FACTOR = 6;

	let items = $state([]);
	let bookmarks = $state(data.bookmarks || []);
	let categories = $state(data.categories || []);
	let fsArticleProps = $state({ visible: false, url: '', color: '' });
	let activeCategoryIndex = $state(0);
	let activeProviderIndex = $state(0);
	let activeCardIndex = $state(null);
	let isLoading = $state(false);
	let interestPickerVisible = $state(false);
	let error = $state(null);
	let swapCategoryModalVisible = $state(false);

	/**
	 * Asynchronously fetches data from a specified source.
	 *
	 * @returns {Promise<any>} A promise that resolves with the fetched data.
	 */
	async function fetchData() {
		if (!categories.length || !browser) return;
		items = [];
		isLoading = true;
		error = null;

		localStorage.setItem('activeCategoryIndex', activeCategoryIndex);
		localStorage.setItem('activeProviderIndex', activeProviderIndex);

		const provider = allCategories[activeProviderIndex];
		const category = provider.categories[activeCategoryIndex];

		try {
			const response = await fetch(`${PROXY_URL}/get?url=${encodeURIComponent(category.url)}`);
			const xml = await response.json();
			if (xml.status.http_code !== 200) error = 'An error occurred while fetching the news';

			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(xml.contents, 'text/xml');
			const itemsElement = xmlDoc.getElementsByTagName('item');

			Array.from(itemsElement).forEach((item, index) => {
				try {
					const title = stripHtml(
						item.getElementsByTagName(provider.previewTitleSelector)[0]?.firstChild.nodeValue
					);
					const url = item.getElementsByTagName(provider.previewUrlSelector)[0]?.firstChild
						.nodeValue;
					const description = stripHtml(
						item.getElementsByTagName(provider.previewDescriptionSelector)[0]?.firstChild.nodeValue
					);
					const date = item.getElementsByTagName(provider.previewDateSelector)[0]?.firstChild
						.nodeValue;
					const img = item
						.getElementsByTagName(provider.previewImgSelector)[0]
						?.getAttribute('url');

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

	// Fetch news on mount
	onMount(async () => {
		activeCategoryIndex = parseInt(localStorage.getItem('activeCategoryIndex')) || 0;
		activeProviderIndex = parseInt(localStorage.getItem('activeProviderIndex')) || 0;
		await fetchData();
	});
	$effect(async () => {
		await fetchData();
	});

	/**
	 * Strips HTML tags from a given string.
	 *
	 * @param {string} html - The HTML string to be stripped of tags.
	 * @returns {string} - The plain text string with HTML tags removed.
	 */
	function stripHtml(html) {
		let tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	}

	/**
	 * Handles the touch start event of the swipeable cards.
	 *
	 * @param {Event} event - The touch start event object.
	 */
	function handleTouchStart(event) {
		const index = activeCardIndex;
		const touch = (event?.touches && event?.touches[0]) ?? { clientX: event.clientX };
		items[index].startX = touch.clientX;
		items[index].currentX = touch.clientX;
	}

	/**
	 * Handles the touch move event of the swipeable cards.
	 *
	 * @param {TouchEvent} event - The touch move event object.
	 */
	function handleTouchMove(event) {
		const index = activeCardIndex;
		if (!items[index]?.startX) return;

		const touch = (event?.touches && event?.touches[0]) ?? { clientX: event.clientX };
		items[index].currentX = touch.clientX;
		const diffX = items[index].currentX - items[index].startX;
		const rotation = diffX / CARD_ROTATION_FACTOR;
		items[index].transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
	}

	/**
	 * Handles the touch end event of the swipeable cards.
	 *
	 * @param {Event} event - The touch end event object.
	 */
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
			} else {
				activeCardIndex++;
			}
			const duration = window.innerWidth / 2 + 225;
			const endValue = diffX > 0 ? duration : -duration;
			const rotation = endValue / CARD_ROTATION_FACTOR;
			items[index].transitionDuration = duration;
			items[index].transform = `translateX(${endValue}px) rotate(${rotation}deg)`;
			items[index].opacity = 0;
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

<ChangeCategory
	bind:visible={swapCategoryModalVisible}
	bind:categories
	bind:activeCategoryIndex
	bind:activeProviderIndex
/>

<Article
	url={fsArticleProps.url}
	bind:bookmarks
	bind:color={fsArticleProps.color}
	bind:visible={fsArticleProps.visible}
	bind:provider={allCategories[activeProviderIndex]}
	title={items[activeCardIndex]?.title}
	date={items[activeCardIndex]?.date}
	img={items[activeCardIndex]?.img}
	onclose={() => {
		activeCardIndex++;
	}}
/>

<div class="h-full grow flex flex-col pb-[5.5rem] overflow-hidden">
	<!-- Heading -->
	<header class="shrink-0 p-4 max-w-md mx-auto w-full">
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

		<hr class="my-4 border-neutral-800" />

		<div class="flex flex-row items-center gap-4">
			<h2 class="w-fit capitalize">
				<b>{categories[activeProviderIndex].name}</b> / {categories[activeProviderIndex].categories[
					activeCategoryIndex
				].label}
			</h2>

			<Button variant="ghost" class="size-8 p-0" onclick={() => (swapCategoryModalVisible = true)}>
				<Swap class="size-6 text-text-heading-dark" />
			</Button>
		</div>
	</header>

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
					style="z-index: {MAX_Z_INDEX - i - 1}; transform: {article.transform ||
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
