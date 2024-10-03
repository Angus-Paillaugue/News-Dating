<script>
	import { formatDate, generateFormattedText } from '$lib/utils';

	const { article } = $props();
</script>

<article
	class="text-text-body rounded-3xl overflow-hidden max-w-md max-h-[700px] h-full"
	style="background-color: #{article.color};"
>
	<div class="relative w-full h-full p-4 md:p-6 flex flex-col gap-4">
		{#if article?.img}
			<img src={article.img} alt="" class="h-1/3 min-h-36 w-full rounded-xl object-cover" />
		{/if}
		<header>
			<h1
				class="leading-8 md:leading-10 text-2xl md:text-3xl font-semibold text-text-heading line-clamp-[8]"
			>
				{@html article.title}
			</h1>
		</header>
		<time datetime={article.date}>{formatDate(article.date)}</time>
		<p class="line-clamp-4 md:line-clamp-6">
			{@html article.description.split(' ').map(generateFormattedText).join(' ')}
		</p>
	</div>
</article>
