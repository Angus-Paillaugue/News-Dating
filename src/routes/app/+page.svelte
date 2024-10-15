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
  const CARD_ROTATION_FACTOR = 6;

  let items = $state([]);
  let bookmarks = $state(data.bookmarks || []);
  let categories = $state(data.categories || []);
  let fsArticleProps = $state({ open: false, url: '', color: '' });
  let activeCategoryIndex = $state(0);
  let activeProviderIndex = $state(0);
  let isLoading = $state(false);
  let interestPickerOpen = $state(false);
  let error = $state(null);
  let swapCategoryModalOpen = $state(false);
  let currentCard = $state(null);
  let nextCard = $state(null);

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

    const provider = categories[activeProviderIndex];
    if(!provider) {
      if(categories.length === 0) {
        error = "Please subscribe to at least one category to read it's content!";
        return;
      } else {
        activeProviderIndex = 0;
        return;
      }
    }
    const category = provider.categories[activeCategoryIndex];
    if(!category) {
      if(provider.categories.length === 0 ) {
        activeProviderIndex = 0
        return;
      }else {
        activeCategoryIndex = 0;
        return
      }
    }

    try {
      const response = await fetch(
        `${PROXY_URL}/get?url=${encodeURIComponent(category.url)}`
      );
      const xml = await response.json();
      if (xml.status.http_code !== 200)
        error = 'An error occurred while fetching the news';

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml.contents, 'text/xml');
      const itemsElement = xmlDoc.getElementsByTagName('item');


      Array.from(itemsElement).forEach((item, index) => {
        try {
          const title = stripHtml(
            item.getElementsByTagName(provider.previewTitleSelector)[0]
              ?.firstChild.nodeValue
          );
          const url = item.getElementsByTagName(provider.previewUrlSelector)[0]
            ?.firstChild.nodeValue;
          const description = stripHtml(
            item.getElementsByTagName(provider.previewDescriptionSelector)[0]
              ?.firstChild.nodeValue
          );
          const date = item.getElementsByTagName(
            provider.previewDateSelector
          )[0]?.firstChild.nodeValue;
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
    if (items.length > 0) {
      currentCard = items[0];
      nextCard = items[1] || null;
    } else {
      currentCard = null;
      nextCard = null;
    }
  }

  // Fetch news on mount
  onMount(async () => {
    activeCategoryIndex =
      parseInt(localStorage.getItem('activeCategoryIndex')) || 0;
    activeProviderIndex =
      parseInt(localStorage.getItem('activeProviderIndex')) || 0;
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
    const touch = (event?.touches && event?.touches[0]) ?? {
      clientX: event.clientX
    };
    currentCard.startX = touch.clientX;
    currentCard.currentX = touch.clientX;
  }

  /**
   * Handles the touch move event of the swipeable cards.
   *
   * @param {TouchEvent} event - The touch move event object.
   */
  function handleTouchMove(event) {
    if (!currentCard?.startX) return;

    const touch = (event?.touches && event?.touches[0]) ?? {
      clientX: event.clientX
    };
    currentCard.currentX = touch.clientX;
    const diffX = currentCard.currentX - currentCard.startX;
    const rotation = diffX / CARD_ROTATION_FACTOR;
    currentCard.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
    currentCard.opacity = 1 - Math.abs(diffX) / window.innerWidth / 4;
  }

  /**
   * Handles the touch end event of the swipeable cards.
   *
   * @param {Event} event - The touch end event object.
   */
  function handleTouchEnd(event) {
    if (!currentCard?.startX) return;
    const cardWidth = event.target.closest('.articleSwipeCard').clientWidth;

    const diffX = currentCard.currentX - currentCard.startX;
    if (Math.abs(diffX) > cardWidth / 4) {
      // If swipe right
      if (diffX > 0) {
        fsArticleProps.url = currentCard.url;
        fsArticleProps.open = true;
        fsArticleProps.color = currentCard.color;
      }
      const endCardPos = window.innerWidth / 2 + cardWidth;
      const endValue = diffX > 0 ? endCardPos : -endCardPos;
      const rotation = endValue / CARD_ROTATION_FACTOR;
      const duration = endCardPos;
      currentCard.transitionDuration = duration;
      currentCard.transform = `translateX(${endValue}px) rotate(${rotation}deg)`;
      currentCard.opacity = 0;
      setTimeout(() => {
        if (items.length > 0) {
          items = items.slice(1);
          currentCard = items[0];
          nextCard = items[1] || null;
        } else {
          currentCard = null;
          nextCard = null;
        }
      }, duration);
    } else {
      const _INITIAL_TRANSITION_DURATION = currentCard.transitionDuration;
      currentCard.transitionDuration = 300;
      currentCard.transform = 'translateX(0) rotate(0)';
      setTimeout(() => {
        currentCard.transitionDuration = _INITIAL_TRANSITION_DURATION;
      }, currentCard.transitionDuration);
    }
    currentCard.startX = null;
  }
</script>

<svelte:head>
  <title>News</title>
</svelte:head>

<svelte:window onmousemove={handleTouchMove} />

<!-- Modal to "subscribe" to a category/provider -->
<InterestPicker
  bind:open={interestPickerOpen}
  bind:categories
  {allCategories}
  onchange={(categoriesBefore, categoriesAfter) => {
    // If the active category was removed or changed index
    if(categoriesBefore[activeProviderIndex]?.id !== categoriesAfter[activeProviderIndex]?.id) {
      const newIndex = categoriesAfter[activeProviderIndex].findIndex((c) => c.id === categoriesBefore[activeProviderIndex].id);

      // If the category was removed, set the active category to the first one available
      // Otherwise, set the active category to the new index
      activeCategoryIndex = newIndex === -1 ? 0 : newIndex;
      fetchData();
    }
  }}
/>

<!-- Change the actively displayed category cards -->
<ChangeCategory
  bind:open={swapCategoryModalOpen}
  bind:categories
  bind:activeCategoryIndex
  bind:activeProviderIndex
/>

<!-- Full article modal -->
<Article
  url={fsArticleProps.url}
  bind:bookmarks
  bind:color={fsArticleProps.color}
  bind:open={fsArticleProps.open}
  bind:provider={allCategories[activeProviderIndex]}
  title={currentCard?.title}
  date={currentCard?.date}
  img={currentCard?.img}
/>

<div class="flex h-full grow flex-col overflow-hidden pb-[5.5rem]">
  <!-- Heading -->
  <header class="mx-auto w-full max-w-md shrink-0 p-4 pb-0">
    <div class="flex flex-row items-center justify-between">
      <!-- App title -->
      <h1 class="text-xl font-extrabold">News Dating</h1>

      <!-- Open categories modal button -->
      <Dropdown align="end">
        <Dropdown.Trigger
          class="rounded-full border border-neutral-500/50 p-1.5"
        >
          <GridBorder class="size-6 text-text-heading-dark" />
        </Dropdown.Trigger>
        {#snippet items()}
          <Dropdown.Item
            onclick={() => {
              interestPickerOpen = true;
            }}>Categories</Dropdown.Item
          >
          <Dropdown.Item href="/app/dashboard">Account</Dropdown.Item>
        {/snippet}
      </Dropdown>
    </div>
  </header>

  <!-- Active category selector -->
  <div class="mx-auto w-full max-w-md p-4 pt-0">
    <!-- Vertical separator -->
    <hr class="my-4 border-neutral-800" />
    <div class="flex flex-row items-center gap-4">
      <h2 class="w-fit capitalize">
        <b>{categories[activeProviderIndex].name}</b> / {categories[
          activeProviderIndex
        ].categories[activeCategoryIndex]?.label}
      </h2>

      <!-- Open active category selector modal -->
      <Button
        variant="ghost"
        class="size-8 p-0"
        onclick={() => (swapCategoryModalOpen = true)}
      >
        <Swap class="size-6 text-text-heading-dark" />
      </Button>
    </div>
  </div>

  <!-- Main content -->
  <div class="relative flex grow flex-col items-center justify-center">
    {#if isLoading}
      <!-- If is fetching news and parsing them -->
      <Spinner class="size-8" />
    {:else if items.length === 0}
      <!-- If there are no more news card to display -->
      <div
        class="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl px-6 py-4 text-text-heading"
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
    {:else if currentCard}
      {#key currentCard.url}
        <!-- Display next card (for removing transition stutter) -->
        {#if nextCard}
          <div
            class="absolute bottom-4 left-4 right-4 top-0 mx-auto max-h-[700px] max-w-md overflow-hidden rounded-3xl transition-all"
          >
            <Card article={nextCard} />
          </div>
        {/if}
        <!-- Display current card -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="articleSwipeCard absolute bottom-4 left-4 right-4 top-0 mx-auto max-h-[700px] max-w-md overflow-hidden rounded-3xl transition-all"
          style="transform: {currentCard.transform ||
            'translateX(0) rotate(0)'}; transition-duration: {currentCard.transitionDuration ??
            '75'}ms; opacity: {currentCard.opacity ?? '1'};"
          ontouchstart={handleTouchStart}
          ontouchmove={handleTouchMove}
          ontouchend={handleTouchEnd}
          onmousedown={handleTouchStart}
          onmouseup={handleTouchEnd}
          onmouseleave={handleTouchEnd}
        >
          <Card article={currentCard} />
        </div>
      {/key}
    {:else if error}
      <!-- If any error was thrown during the fetching process -->
      <div
        class="mx-auto flex max-w-md flex-row items-center gap-4 rounded-3xl px-6 py-4 text-text-heading"
        style="background-color: #{CARDS_COLORS[0]};"
      >
        <CircleX class="size-6 shrink-0 text-red-600" />
        <h1 class="text-xl font-medium text-inherit">{error}</h1>
      </div>
    {/if}
  </div>
</div>
