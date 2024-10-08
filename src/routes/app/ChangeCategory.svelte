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
	let newActiveProviderIndex = $state(null);
	let newActiveCategoryIndex = $state(null);
	let step = $state(0);
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
		<!-- Step 0 - Choosing the provider -->
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
			<!-- Step 1 - Choosing the category -->
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
			<!-- Close/Back button - depends of the active step -->
			<Button
				class="h-12 disabled:opacity-100 disabled:bg-neutral-600 relative overflow-hidden"
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
				class="h-12 disabled:opacity-100 disabled:bg-neutral-600 relative overflow-hidden"
				disabled={step === 0 ? newActiveProviderIndex === null : newActiveCategoryIndex === null}
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
