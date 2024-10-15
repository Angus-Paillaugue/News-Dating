<script>
  import { scale, fly } from 'svelte/transition';
  import { CARDS_COLORS } from '$lib/constants';
  import { showNavbar } from '$lib/stores';
  import { cn, accordion } from '$lib/utils';
  import { Check } from '$lib/components/icons';
  import { quintOut } from 'svelte/easing';
  import { Button, Spinner, HorizontalScroll, Modal } from '$lib/components';
  import { spring } from 'svelte/motion';

  const COLOR = CARDS_COLORS[2];
  let {
    open = $bindable(false),
    categories = $bindable([]),
    allCategories,
    onchange
  } = $props();
  let initialCategories = JSON.parse(JSON.stringify(categories));
  let isSavingCategories = $state(false);
  let hasUnsavedChanges = $state(false);
  let displayedCategories = $state(allCategories);
  let languageFilterValue = $state('all');
  let activeProviderIndex = $state(0);
  let unsavedCategories = $state(categories);
  let newCategoryIds = $state([]);
  let error = $state(null);
  let languages = [
    ...new Set(allCategories.map((p) => p.categories.map((c) => c.lang)).flat())
  ];
  let activeProviderIndicatorPos = spring(
    { x: 0, width: 0 },
    { stiffness: 0.1, damping: 0.25 }
  );

  // Get all category ids
  $effect(() => {
    newCategoryIds = unsavedCategories
      .map((p) => (p.categories || []).map((c) => c.id))
      .flat();
  });

  // Check if there are unsaved changes
  $effect(() => {
    const oldCategoryIds = initialCategories
      .map((p) => p.categories.map((c) => c.id))
      .flat();
    hasUnsavedChanges =
      newCategoryIds.some((id) => !oldCategoryIds.includes(id)) ||
      oldCategoryIds.some((id) => !newCategoryIds.includes(id));
  });

  // Reset categories when the modal is closed
  $effect(() => {
    if (open) {
      showNavbar.set(false);
      languageFilterValue = 'all';
      unsavedCategories = JSON.parse(JSON.stringify(initialCategories));
    } else {
      showNavbar.set(true);
    }
  });

  // Filter categories by language
  $effect(() => {
    if (languageFilterValue === 'all') {
      displayedCategories = allCategories;
    } else {
      displayedCategories = allCategories.map((provider) => {
        return {
          ...provider,
          categories: provider.categories.filter(
            (c) => c.lang === languageFilterValue
          )
        };
      });
    }
  });

  // Update the active provider indicator position
  $effect(() => {
    const activeProviderButton = document.querySelectorAll(
      '#activeProviderContainer > button'
    )[activeProviderIndex];
    if (!open || !activeProviderButton) return;
    activeProviderIndicatorPos.set({
      x: activeProviderButton.offsetLeft,
      width: activeProviderButton.offsetWidth
    });
  });

  /**
   * Asynchronously saves the selected categories.
   * This function is typically called when the user confirms their category selections.
   * It performs necessary operations to persist the selected categories.
   */
  async function saveCategories() {
    if (!hasUnsavedChanges) {
      open = false;
      return;
    }
    isSavingCategories = true;
    const res = await fetch('/api/updateCategories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        categories: newCategoryIds
      })
    });
    isSavingCategories = false;
    if (res.ok) {
      categories = unsavedCategories;
      initialCategories = JSON.parse(JSON.stringify(categories));
      hasUnsavedChanges = false;
      onchange(initialCategories, categories);
      open = false;
    } else {
      const data = await res.json();
      error = data.message;
    }
  }
</script>

<Modal bind:open color={COLOR} containerClasses="max-md:h-full">
  <!-- Title and language select -->
  <div class="flex w-full flex-row items-center justify-start gap-8 p-4 md:p-6">
    <h1 class="text-2xl font-bold text-text-heading">Categories</h1>
    <select
      class="ml-auto block rounded-xl bg-white p-2.5 text-sm text-text-body"
      bind:value={languageFilterValue}
    >
      <option value="all" selected>All</option>
      {#each languages as lang}
        <option value={lang}>{lang}</option>
      {/each}
    </select>
  </div>

  <!-- Provider selector -->
  <HorizontalScroll
    class="relative mb-4 w-full shrink-0 gap-4 px-4"
    id="activeProviderContainer"
  >
    <span
      class="absolute z-0 h-full rounded-full bg-white"
      style="width: {$activeProviderIndicatorPos.width}px; left: {$activeProviderIndicatorPos.x}px;"
    ></span>
    {#each displayedCategories as provider, i}
      <button
        class="z-10 shrink-0 rounded-full px-2 py-2 font-medium capitalize text-text-heading"
        onclick={() => (activeProviderIndex = i)}
      >
        {provider.name}
      </button>
    {/each}
  </HorizontalScroll>

  <!-- Categories list -->
  <div class="flex w-full grow flex-col overflow-y-hidden p-4 pt-0 md:h-[70vh]">
    <div
      class="no-scrollbar relative flex grow flex-col overflow-y-auto rounded-2xl"
    >
      <div class="flex grow flex-col gap-4">
        <!-- For each category of the selected provider -->
        {#each displayedCategories[activeProviderIndex].categories as category}
          {@const isInUsersCategories = newCategoryIds.includes(category.id)}
          <div class="ietms-center relative flex w-full flex-row">
            <!-- Background image used to get smooth and inset border radius -->
            <img
              src="/input-checkbox-combo-bg.svg"
              alt="Background"
              class="absolute left-0 top-0 h-full"
            />
            <div
              class="z-10 flex grow flex-row items-center gap-[55px] md:gap-[63px]"
            >
              <!-- Pseudo checkbox -->
              <div class="p-2">
                <button
                  aria-label="Toggle category"
                  class={cn(
                    'flex size-10 flex-col items-center justify-center rounded-full transition-all md:size-12',
                    isInUsersCategories ? 'bg-neutral-800' : 'bg-white'
                  )}
                  onclick={() => {
                    // New category to add
                    const newItem = displayedCategories[
                      activeProviderIndex
                    ].categories.find((c) => c.id === category.id);
                    // If is removing from subscribed categories
                    if (isInUsersCategories) {
                      for (let i = 0; i < unsavedCategories.length; i++) {
                        const index = unsavedCategories[i].categories.findIndex(
                          (c) => c.id === category.id
                        );
                        if (index !== -1) {
                          unsavedCategories[i].categories.splice(index, 1);
                          break;
                        }
                      }
                    } else {
                      // Adding to user's subscriptions
                      const providerExists = unsavedCategories
                        .map((p) => p.id)
                        .includes(displayedCategories[activeProviderIndex].id);
                      // If the selected provider is not in user's subscriptions
                      if (!providerExists) {
                        const provider = JSON.parse(JSON.stringify(displayedCategories[activeProviderIndex]));
                        provider.categories = [newItem];
                        unsavedCategories.push(provider);
                      } else {
                        const activeProvider = displayedCategories[activeProviderIndex];
                        const index = unsavedCategories.findIndex(p => p.id === activeProvider.id);
                        unsavedCategories[index].categories.push(
                          newItem
                        );
                      }
                    }
                  }}
                >
                  {#if isInUsersCategories}
                    <div
                      transition:scale={{
                        easing: quintOut,
                        start: 0,
                        duration: 300
                      }}
                    >
                      <Check class="size-6 text-white" />
                    </div>
                  {/if}
                </button>
              </div>
              <div
                class="relative flex h-full grow flex-row items-center justify-between gap-4 rounded-r-full bg-white pr-14"
              >
                <p class="grow text-base font-medium">{category.label}</p>
                <!-- Category language pill -->
                <div
                  class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-neutral-800 px-3 py-0.5 text-center text-lg font-semibold text-white"
                >
                  {category.lang}
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
    <div class="mt-4 flex flex-col gap-2">
      <!-- Error -->
      <div use:accordion={error || categories.length === 0}>
        <div
          class="rounded-3xl bg-red-600/50 px-6 py-2 text-base font-semibold text-text-heading-dark"
        >
          {categories.length === 0
            ? 'Please subscribe to at least one category feed !'
            : error}
        </div>
      </div>
      <!-- Save button -->
      <Button
        class="relative h-12 overflow-hidden disabled:bg-neutral-600 disabled:opacity-100"
        onclick={saveCategories}
        disabled={categories.length === 0}
      >
        {#if !hasUnsavedChanges || categories.length === 0}
          <div
            transition:fly={{ y: '100%', duration: 400, opacity: 0 }}
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            Close
          </div>
        {:else}
          <div
            transition:fly={{ y: '100%', duration: 400, opacity: 0 }}
            class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-row items-center gap-4"
          >
            {#if isSavingCategories}
              <Spinner class="size-6" />
            {/if}
            Save
          </div>
        {/if}
      </Button>
    </div>
  </div>
</Modal>
