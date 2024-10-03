<script>
  import { scale, fade, fly } from 'svelte/transition';
  import { CARDS_COLORS} from '$lib/constants';
  import { showNavbar } from '$lib/stores';
  import { cn } from '$lib/utils';
  import Close from '$lib/components/icons/Close.svelte';
  import Check from '$lib/components/icons/Check.svelte';
  import { backOut, quintOut } from 'svelte/easing';
  import Spinner from '$lib/components/Spinner.svelte';

  const COLOR = CARDS_COLORS[2];
  let { visible = $bindable(false), categories = $bindable([]), allCategories } = $props();
  let initialCategories = JSON.parse(JSON.stringify(categories));
  let isSavingCategories = $state(false);
  let hasUnsavedChanges = $state(false);
  let displayedCategories = $state(allCategories);
  let confirmCloseModalVisible = $state(false);
  let languageFilterValue = $state('all');
  const languages = new Set(allCategories.map(c => c.lang));

  $effect(() => {
    hasUnsavedChanges = categories.some((c) => !initialCategories.some((ic) => ic.id === c.id)) || initialCategories.some((ic) => !categories.some((c) => c.id === ic.id));
  });

	$effect(() => {
		if (visible) {
			showNavbar.set(false);
      languageFilterValue = 'all';
      categories = JSON.parse(JSON.stringify(initialCategories));
		} else {
			showNavbar.set(true);
		}
	});

  $effect(() => {
    if (languageFilterValue === 'all') {
      displayedCategories = allCategories;
    } else {
      displayedCategories = allCategories.filter((c) => c.lang === languageFilterValue);
    }
  });

  async function saveCategories() {
    if(!hasUnsavedChanges) {
      visible = false;
      return;
    }
    isSavingCategories = true;
    await fetch('/api/updateCategories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categories }),
    });
    isSavingCategories = false;
    visible = false;
    initialCategories = JSON.parse(JSON.stringify(categories));
  }
</script>

<!-- Confirm close modal -->
{#if confirmCloseModalVisible}
  <!-- Backdrop -->
	<div
		class="backdrop-blur-md fixed inset-0"
		style="z-index: 10001;"
		transition:fade={{ duration: 500 }}
	></div>
  <!-- Alert -->
	<div
		class="fixed inset-0 flex flex-col items-center justify-center md:p-4"
		style="z-index: 10002;"
		transition:scale={{ duration: 500 }}
	>
    <div
			class="flex flex-col items-start justify-start relative w-full max-w-screen-md md:rounded-3xl p-6"
			style="background-color: #{CARDS_COLORS[0]};"
		>
      <!-- Title -->
      <p class="text-lg">Are you sure you want to exit with unsaved changes ?</p>

      <!-- Button group -->
      <div class="grid grid-cols-2 md:grid-cols-2 gap-8 w-full mt-4">
        <button class="sticky bottom-0 left-0 right-0 flex flex-row items-center justify-center text-lg font-medium gap-2 w-full px-4 py-2 bg-neutral-800 rounded-full text-text-heading-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all" onclick={() => {confirmCloseModalVisible = false; visible = false; categories = JSON.parse(JSON.stringify(initialCategories))}}>Yes, Exit</button>
        <button class="sticky bottom-0 left-0 right-0 flex flex-row items-center justify-center text-lg font-medium gap-2 w-full px-4 py-2 bg-neutral-100 rounded-full text-text-heading disabled:opacity-50 disabled:cursor-not-allowed transition-all" onclick={() => {confirmCloseModalVisible = false;}}>No, cancel</button>
      </div>
    </div>
  </div>
{/if}

{#if visible}
	<!-- Backdrop -->
	<div
		class="backdrop-blur-md fixed inset-0"
		style="z-index: 9999;"
		transition:fade={{ duration: 500 }}
	></div>

	<!-- Modal -->
	<div
		class="fixed inset-0 flex flex-col items-center justify-center md:p-4"
		style="z-index: 10000;"
		transition:fly={{ y:'100%', duration: 500 }}
	>
		<div
			class="flex flex-col items-start justify-start relative h-full w-full max-w-screen-md md:rounded-3xl"
			style="background-color: #{COLOR};"
		>
      <div class="p-4 md:p-6 flex w-full flex-row justify-start gap-8 items-center">
        <h1 class="text-text-heading font-bold text-2xl">Categories</h1>
        <select name="" id="" class="ml-auto bg-white text-text-body text-sm rounded-xl block p-2.5" bind:value={languageFilterValue}>
          <option value="all" selected>All</option>
          {#each languages as lang}
            <option value={lang}>{lang}</option>
          {/each}
        </select>
      </div>

      <!-- Categories list -->
      <div class="grow flex overflow-y-hidden w-full flex-col p-6 pt-0">
        <div class="overflow-y-auto no-scrollbar grow rounded-3xl flex flex-col relative">
          <div class="flex flex-col gap-4 grow">
            {#each displayedCategories as category, i}
              {@const isInUsersCategories = categories.some((c) => c.id === category.id)}
              <div class="w-full relative flex flex-row ietms-center">
                <img src='/input-checkbox-combo-bg.svg' alt="Background" class="absolute top-0 h-16 left-0" />
                <div class="flex flex-row items-center grow gap-[63px] z-10">
                  <div class="p-2">
                    <button aria-label="Toggle category" class={cn("size-12 rounded-full flex flex-col items-center justify-center transition-all border", isInUsersCategories ? 'bg-neutral-800 border-white' : 'border-neutral-300/50 bg-white')} onclick={() => {
                      if (isInUsersCategories) {
                        categories = categories.filter((c) => c.id !== category.id);
                      } else {
                        categories = [...categories, category];
                      }
                    }}>
                    {#if isInUsersCategories}
                      <div transition:scale={{ easing:quintOut, start:0, duration:300 }}>
                        <Check class="size-6 text-white" />
                      </div>
                    {/if}
                    </button>
                  </div>
                  <div class="bg-white grow rounded-r-full flex flex-row items-center justify-between pr-4 h-full">
                    <p class="text-base font-medium">{category.label}</p>
                    <div class="bg-neutral-800 text-white px-3 py-0.5 text-center text-xl font-bold rounded-full">
                      {category.lang}
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>

        </div>
        <!-- Save button -->
        <button class="flex flex-row items-center justify-center text-lg font-medium gap-2 w-full h-12 bg-neutral-800 rounded-full text-text-heading-dark disabled:bg-neutral-600 disabled:cursor-not-allowed transition-all mt-6 relative overflow-hidden" onclick={saveCategories}>
          {#if !hasUnsavedChanges}
            <div transition:fly={{ y:'100%', duration:400, opacity:0 }} class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
              Close
            </div>
          {:else}
            <div transition:fly={{ y:'100%', duration:400, opacity:0 }} class="flex flex-row gap-4 items-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
              {#if isSavingCategories}
                <Spinner class="size-6" />
              {/if}
              Save
            </div>
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}
