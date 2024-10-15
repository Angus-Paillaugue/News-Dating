<script>
  import { CARDS_COLORS } from '$lib/constants';
  import { cn } from '$lib/utils';
  import { Button, Modal } from '$lib/components';

  let {
    open = $bindable(false),
    activeProviderIndex = $bindable(),
    activeCategoryIndex = $bindable(),
    categories = $bindable([])
  } = $props();
  let newActiveProviderIndex = $state(activeProviderIndex);
  let newActiveCategoryIndex = $state(activeCategoryIndex);
  let step = $state(0);

  // Reset internal indexes if changed from the outside
  $effect(() => {
    newActiveProviderIndex = activeProviderIndex;
    newActiveCategoryIndex = activeCategoryIndex;
  });
</script>

<!-- When escape key is pressed and is a the second step, get back to the first step -->
<svelte:window
  onkeydown={(e) => {
    if (step === 1 && e.key === 'Escape') {
      step = 0;
      e.stopPropagation();
    }
  }}
/>

<Modal bind:open color={CARDS_COLORS[2]} dismissible={step === 0}>
  <!-- Title -->
  <div
    class="mb-4 flex w-full flex-row items-center justify-start gap-8 p-4 md:mb-2 md:p-6"
  >
    <h1 class="text-2xl font-bold text-text-heading">
      {#if step === 0}
        Choose provider
      {:else}
        Choose category
      {/if}
    </h1>
  </div>

  <!-- Categories list -->
  <div class="flex w-full grow flex-col overflow-y-hidden p-4 pt-0 md:p-6">
    <!-- Step 0 - Choosing the provider -->
    {#if step === 0}
      <div
        class="no-scrollbar relative flex max-h-[300px] grow flex-col overflow-y-auto"
      >
        {#each categories as provider, i}
          <button
            class={cn(
              'shrink-0 rounded-3xl py-2 text-start text-lg font-medium capitalize text-text-heading transition-all duration-200',
              newActiveProviderIndex === i &&
                'bg-neutral-800 px-4 text-text-heading-dark'
            )}
            onclick={() => {
              newActiveProviderIndex = i;
            }}
          >
            {provider.name}
          </button>
        {/each}
      </div>
    {:else}
      <!-- Step 1 - Choosing the category -->
      <div
        class="no-scrollbar relative flex max-h-[300px] grow flex-col overflow-y-auto"
      >
        {#each categories[newActiveProviderIndex].categories as category, i}
          <button
            class={cn(
              'shrink-0 rounded-3xl py-2 text-start text-xl font-medium capitalize text-text-heading transition-all duration-200',
              newActiveCategoryIndex === i &&
                'bg-neutral-800 px-4 text-text-heading-dark'
            )}
            onclick={() => {
              newActiveCategoryIndex = i;
            }}
          >
            {category.label}
          </button>
        {/each}
      </div>
    {/if}

    <!-- Action buttons -->
    <div class="mt-8 grid grid-cols-2 gap-2">
      <!-- Close/Back button - depends of the active step -->
      <Button
        class="relative h-12 overflow-hidden disabled:bg-neutral-600 disabled:opacity-100"
        variant="secondary"
        onclick={() => {
          if (step === 0) {
            newActiveProviderIndex = null;
            newActiveCategoryIndex = null;
            open = false;
          } else {
            newActiveProviderIndex = null;
            step = 0;
          }
        }}
      >
        {step === 0 ? 'Close' : 'Back'}
      </Button>

      <!-- Next/Choose button - depends of the active step -->
      <Button
        class="relative h-12 overflow-hidden disabled:bg-neutral-600 disabled:opacity-100"
        disabled={step === 0
          ? newActiveProviderIndex === null
          : newActiveCategoryIndex === null}
        onclick={() => {
          if (step === 0) {
            step = 1;
          } else {
            open = false;
            activeProviderIndex = newActiveProviderIndex;
            activeCategoryIndex = newActiveCategoryIndex;
            newActiveProviderIndex = null;
            newActiveCategoryIndex = null;

            step = 0;
          }
        }}
      >
        {step === 0 ? 'Next' : 'Choose'}
      </Button>
    </div>
  </div>
</Modal>
