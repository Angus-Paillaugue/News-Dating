<script>
  import { formatDate, generateFormattedText, cn } from '$lib/utils';

  const { article, class: className } = $props();
</script>

<article
  class={cn(
    'h-full max-h-[700px] max-w-md overflow-hidden rounded-3xl text-text-heading',
    className
  )}
  style="background-color: #{article.color};"
>
  <div
    class="relative flex h-full w-full select-none flex-col gap-4 p-4 md:p-6"
  >
    {#if article?.img}
      <img
        src={article.img}
        draggable="false"
        alt=""
        class="h-1/3 min-h-36 w-full rounded-xl object-cover"
      />
    {/if}
    <header>
      <h1
        class="line-clamp-4 text-2xl font-semibold leading-8 text-inherit md:line-clamp-[8] md:text-3xl md:leading-10"
      >
        {@html article.title}
      </h1>
    </header>
    <time datetime={article.date}>{formatDate(article.date)}</time>
    <p class="line-clamp-4 break-words md:line-clamp-6">
      {@html article.description
        .split(' ')
        .map(generateFormattedText)
        .join(' ')}
    </p>
  </div>
</article>
