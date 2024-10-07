<script>
	import { fade, fly } from 'svelte/transition';
	import { CARDS_COLORS } from '$lib/constants';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components';

	const COLOR = CARDS_COLORS[2];
	let {
		visible = $bindable(false),
		activeProviderIndex = $bindable(),
		activeCategoryIndex = $bindable(),
		categories = $bindable([])
	} = $props();
	let newActiveProviderIndex = $state(null);
	let newActiveCategoryIndex = $state(null);
	let step = $state(0);
</script>

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
		transition:fly={{ y: '100%', duration: 500 }}
	>
		<div
			class="flex flex-col items-start justify-start relative w-full max-w-md rounded-3xl"
			style="background-color: #{COLOR};"
		>
			<div class="p-4 md:p-6 mb-4 md:mb-2 flex w-full flex-row justify-start gap-8 items-center">
				<h1 class="text-text-heading font-bold text-2xl">
					{#if step === 0}
						Choose provider
					{:else}
						Choose category
					{/if}
				</h1>
			</div>

			<!-- Categories list -->
			<div class="grow flex overflow-y-hidden w-full flex-col p-4 md:p-6 pt-0">
				{#if step === 0}
					<div class="overflow-y-auto no-scrollbar grow flex flex-col relative max-h-[300px]">
						{#each categories as provider, i}
							<button
								class={cn(
									'shrink-0 font-medium text-lg rounded-3xl capitalize text-text-heading text-start duration-200 transition-all py-2',
									newActiveProviderIndex === i && 'bg-neutral-800 text-text-heading-dark px-4'
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
					<div class="overflow-y-auto no-scrollbar grow flex flex-col relative max-h-[300px]">
						{#each categories[newActiveProviderIndex].categories as category, i}
							<button
								class={cn(
									'shrink-0 font-medium text-xl rounded-3xl capitalize text-text-heading text-start duration-200 transition-all py-2',
									newActiveCategoryIndex === i && 'bg-neutral-800 text-text-heading-dark px-4'
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
				<div class="grid grid-cols-2 mt-8 gap-2">
					<Button
						class="h-12 disabled:opacity-100 disabled:bg-neutral-600 relative overflow-hidden"
						variant="secondary"
						onclick={() => {
							if (step === 0) {
								newActiveProviderIndex = null;
								newActiveCategoryIndex = null;
								visible = false;
							} else {
								newActiveProviderIndex = null;
								step = 0;
							}
						}}
					>
						{step === 0 ? 'Close' : 'Back'}
					</Button>

					<Button
						class="h-12 disabled:opacity-100 disabled:bg-neutral-600 relative overflow-hidden"
						disabled={step === 0
							? newActiveProviderIndex === null
							: newActiveCategoryIndex === null}
						onclick={() => {
							if (step === 0) {
								step = 1;
							} else {
								visible = false;
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
		</div>
	</div>
{/if}
