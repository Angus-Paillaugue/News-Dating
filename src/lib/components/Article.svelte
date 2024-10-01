<script>
	import { formatDate, generateFormattedText } from '$lib/utils';
	import { scale } from 'svelte/transition';
	import Spinner from './Spinner.svelte';
	import BookmarkFull from '$lib/components/icons/BookmarkFull.svelte';
	import BookmarkBorder from '$lib/components/icons/BookmarkBorder.svelte';
	import Share from '$lib/components/icons/Share.svelte';
	import Check from '$lib/components/icons/Check.svelte';
	import Close from '$lib/components/icons/Close.svelte';
	import ChevronsRight from '$lib/components/icons/ChevronsRight.svelte';

	let loading = $state(true);
	let {
		url,
		visible = $bindable(false),
		color = $bindable(''),
		bookmarks = $bindable([]),
		onBookmarkChange
	} = $props();
	let article = $state({ title: '', paragraphs: [], date: '' });
	let shared = $state(false);
	let isBookmarked = $state(
		bookmarks.some((b) => encodeURIComponent(b.url) === encodeURIComponent(url))
	);
	let isBookmarking = $state(false);
	$effect(() => {
		isBookmarked = bookmarks.some((b) => encodeURIComponent(b.url) === encodeURIComponent(url));
	});

	const PROXY_URL = 'http://localhost:1458';
	async function fetchContents(url) {
		loading = true;
		const response = await fetch(`${PROXY_URL}/get?url=${encodeURIComponent(url)}`);
		const xml = await response.json();

		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(xml.contents, 'text/html');
		const contentContainer = xmlDoc.querySelector('.t-content__body');
		const pageContents = contentContainer.querySelectorAll(
			'p:not(.o-self-promo p), h1, h2, h3, h4, h5, h6, img'
		);
		const title = xmlDoc.querySelector('.t-content__title').textContent;
		const date = xmlDoc
			.querySelector('meta[property="article:published_time"]')
			.getAttribute('content');
		const image = xmlDoc.querySelector('.t-content__main-media > figure img').getAttribute('src');

		article.paragraphs = Array.from(pageContents).map((p) => {
			if (p.tagName === 'IMG')
				return { tag: p.tagName.toLowerCase(), content: p.getAttribute('src') };
			return { tag: p.tagName.toLowerCase(), content: p.textContent };
		});
		article.title = title;
		article.date = new Date(date);
		article.image = image;
		loading = false;
	}

	$effect(async () => {
		if (!url || !visible) return;
		await fetchContents(url);
	});

	async function toggleBookmark() {
		isBookmarking = true;
		if (isBookmarked) {
			const res = await fetch('/api/removeBookmark', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id: bookmarks.find((b) => b.url === url).id })
			});
			if (res.ok) isBookmarked = false;
			isBookmarking = false;
			bookmarks = bookmarks.filter((b) => b.url !== url);
			if (onBookmarkChange) onBookmarkChange(bookmarks);
		} else {
			const res = await fetch('/api/addBookmark', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					url,
					title: article.title,
					date: article.date,
					img: article.image,
					color: color,
					description: article.paragraphs.map((p) => p.content).join('\n')
				})
			});
			if (res.ok) isBookmarked = true;
			isBookmarking = false;
			if (onBookmarkChange) onBookmarkChange(bookmarks);
		}
	}
</script>

{#if visible}
	<div
		class="fixed inset-0 flex flex-col items-center justify-center md:p-4 md:pb-14"
		style="z-index: 10000;"
		transition:scale={{ duration: 500 }}
	>
		<div
			class="flex flex-col items-start justify-start relative h-full w-full max-w-screen-md rounded-3xl"
			style="background-color: #{color};"
		>
			{#if loading}
				<Spinner class="size-8 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />
			{:else}
				<!-- Action buttons -->
				<div class="p-4 md:p-6 flex w-full flex-row justify-between items-start">
					<button
						onclick={() => (visible = false)}
						class="rounded-full p-2 text-text-body"
						aria-label="Close"
						style="background-color: #{color}; filter: brightness(93%);"
					>
						<Close class="size-6" />
					</button>
					<div class="flex flex-row items-center gap-6">
						<button
							class="rounded-full p-2 text-text-body"
							aria-label="Share"
							style="background-color: #{color}; filter: brightness(93%);"
							onclick={() => {
								if ('share' in navigator) navigator.share({ url });
								else navigator.clipboard.writeText(url);
								shared = true;
								setTimeout(() => {
									shared = false;
								}, 1500);
							}}
						>
							{#if shared}
								<div in:scale>
									<Check class="size-6" />
								</div>
							{:else}
								<div in:scale>
									<Share class="size-6" />
								</div>
							{/if}
						</button>
						<button
							class="rounded-full p-2 text-text-body group"
							aria-label="Add to bookmarks"
							style="background-color: #{color}; filter: brightness(93%);"
							onclick={toggleBookmark}
						>
							{#if isBookmarking}
								<div in:scale>
									<Spinner class="size-6" />
								</div>
							{:else if isBookmarked}
								<div in:scale>
									<BookmarkFull class="size-6" />
								</div>
							{:else}
								<div in:scale>
									<BookmarkBorder class="size-6" />
								</div>
							{/if}
						</button>
					</div>
				</div>
				<div class="grow flex overflow-y-hidden flex-col p-6 pt-0">
					<div class="overflow-y-auto no-scrollbar grow rounded-3xl pb-20 md:pb-4">
						<!-- Main image -->
						<div class="relative w-full">
							<img src={article.image} class="w-full" alt="" />
							<div
								class="absolute bottom-0 left-0 right-0 p-2 pt-24 bg-gradient-to-b from-transparent to-95%"
								style="--tw-gradient-to: #{color} var(--tw-gradient-to-position);"
							></div>
						</div>
						<h1 class="leading-10 text-3xl font-semibold text-text-heading mt-2">
							{article.title}
						</h1>
						<time datetime={article.date} class="text-sm text-neutral-600"
							>{formatDate(article.date)}</time
						>
						{#each article.paragraphs as p}
							{#if p.tag === 'p'}
								<p class="leading-6 text-neutral-700 font-medium mt-4">
									{@html p.content.split(' ').map(generateFormattedText).join(' ')}
								</p>
							{:else if p.tag === 'h1'}
								<h1
									class="leading-8 md:leading-10 text-2xl md:text-3xl font-semibold text-text-heading mt-4"
								>
									{p.content}
								</h1>
							{:else if p.tag === 'h2'}
								<h2
									class="leading-7 md:leading-9 text-xl md:text-2xl font-semibold text-text-heading mt-4"
								>
									{p.content}
								</h2>
							{:else if p.tag === 'h3'}
								<h3
									class="leading-6 md:leading-8 text-lg md:text-xl font-semibold text-text-heading mt-4"
								>
									{p.content}
								</h3>
							{:else if p.tag === 'h4'}
								<h4
									class="leading-5 md:leading-7 text-base md:text-lg font-semibold text-text-heading mt-4"
								>
									{p.content}
								</h4>
							{:else if p.tag === 'h5'}
								<h5
									class="leading-4 md:leading-6 text-sm md:text-base font-semibold text-text-heading mt-4"
								>
									{p.content}
								</h5>
							{:else if p.tag === 'h6'}
								<h6
									class="leading-3 md:leading-5 text-xs md:text-sm font-semibold text-text-heading mt-4"
								>
									{p.content}
								</h6>
							{:else if p.tag === 'img'}
								<img src={p.content} class="w-full rounded-xl" alt="" />
							{/if}
						{/each}
						<a
							href={url}
							target="_blank"
							class="inline-flex flex-row items-center gap-2 text-text-body mt-4 underline underline-offset-2"
						>
							Read original
							<ChevronsRight class="size-5" />
						</a>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
