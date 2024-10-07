<script>
	import { scale, fade, fly } from 'svelte/transition';
	import { CARDS_COLORS } from '$lib/constants';
	import { showNavbar } from '$lib/stores';
	import { cn, accordion } from '$lib/utils';
	import { Check } from '$lib/components/icons';
	import { quintOut } from 'svelte/easing';
	import { Button, Spinner } from '$lib/components';

	const COLOR = CARDS_COLORS[2];
	let {
		visible = $bindable(false),
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
	let error = $state(null);

	let languages = $state([]);
	$effect(() => {
		const langs = allCategories.map((p) => p.categories.map((c) => c.lang)).flat();
		languages = [...new Set(langs)];
	});

	$effect(() => {
		const newCategoryIds = categories.map((p) => p.categories.map((c) => c.id)).flat();
		const oldCategoryIds = initialCategories.map((p) => p.categories.map((c) => c.id)).flat();
		hasUnsavedChanges =
			newCategoryIds.some((id) => !oldCategoryIds.includes(id)) ||
			oldCategoryIds.some((id) => !newCategoryIds.includes(id));
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
			displayedCategories = allCategories.map((provider) => {
				return {
					...provider,
					categories: provider.categories.filter((c) => c.lang === languageFilterValue)
				};
			});
		}
	});

	async function saveCategories() {
		if (!hasUnsavedChanges) {
			visible = false;
			return;
		}
		isSavingCategories = true;
		const res = await fetch('/api/updateCategories', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				categories: categories.map((p) => p.categories.map((c) => c.id)).flat()
			})
		});
		isSavingCategories = false;
		if (res.ok) {
			initialCategories = JSON.parse(JSON.stringify(categories));
			hasUnsavedChanges = false;
			visible = false;
			onchange();
		} else {
			const data = await res.json();
			error = data.message;
		}
	}
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
			class="flex flex-col items-start justify-start relative h-full w-full max-w-screen-md md:rounded-3xl"
			style="background-color: #{COLOR};"
		>
			<div class="p-4 md:p-6 flex w-full flex-row justify-start gap-8 items-center">
				<h1 class="text-text-heading font-bold text-2xl">Categories</h1>
				<select
					class="ml-auto bg-white text-text-body text-sm rounded-xl block p-2.5"
					bind:value={languageFilterValue}
				>
					<option value="all" selected>All</option>
					{#each languages as lang}
						<option value={lang}>{lang}</option>
					{/each}
				</select>
			</div>
			<div class="flex flex-row gap-4 items-center overflow-x-auto no-scrollbar px-4 shrink-0 mb-4">
				{#each displayedCategories as provider, i}
					<button
						class={cn(
							'shrink-0 font-medium capitalize px-2 py-2 rounded-full text-text-heading',
							activeProviderIndex === i && 'bg-white'
						)}
						onclick={() => (activeProviderIndex = i)}
					>
						{provider.name}
					</button>
				{/each}
			</div>

			<!-- Categories list -->
			<div class="grow flex overflow-y-hidden w-full flex-col p-6 pt-0">
				<div class="overflow-y-auto no-scrollbar grow rounded-3xl flex flex-col relative">
					<div class="flex flex-col gap-4 grow">
						{#each displayedCategories[activeProviderIndex].categories as category}
							{@const isInUsersCategories = categories
								.map((p) => p.categories.map((c) => c.id))
								.flat()
								.includes(category.id)}
							<div class="w-full relative flex flex-row ietms-center">
								<img
									src="/input-checkbox-combo-bg.svg"
									alt="Background"
									class="absolute top-0 h-16 left-0"
								/>
								<div class="flex flex-row items-center grow gap-[63px] z-10">
									<div class="p-2">
										<button
											aria-label="Toggle category"
											class={cn(
												'size-12 rounded-full flex flex-col items-center justify-center transition-all border',
												isInUsersCategories
													? 'bg-neutral-800 border-white'
													: 'border-neutral-300/50 bg-white'
											)}
											onclick={() => {
												const newItem = allCategories[activeProviderIndex].categories.find(
													(c) => c.id === category.id
												);
												if (isInUsersCategories) {
													for (let i = 0; i < categories.length; i++) {
														const index = categories[i].categories.findIndex(
															(c) => c.id === category.id
														);
														if (index !== -1) {
															categories[i].categories.splice(index, 1);
															break;
														}
													}
												} else {
													const providerExists = categories
														.map((p) => p.id)
														.includes(allCategories[activeProviderIndex].id);
													if (!providerExists) {
														const provider = allCategories[activeProviderIndex];
														provider.categories = [newItem];
														categories.push(provider);
													} else {
														categories[activeProviderIndex].categories.push(newItem);
													}
												}
											}}
										>
											{#if isInUsersCategories}
												<div transition:scale={{ easing: quintOut, start: 0, duration: 300 }}>
													<Check class="size-6 text-white" />
												</div>
											{/if}
										</button>
									</div>
									<div
										class="bg-white grow rounded-r-full flex flex-row items-center justify-between pr-4 h-full gap-4"
									>
										<p class="text-base font-medium grow">{category.label}</p>
										<div
											class="bg-neutral-800 text-white px-3 py-0.5 text-center text-xl font-bold rounded-full"
										>
											{category.lang}
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
				<div class="flex flex-col mt-4 gap-2">
					<div class="" use:accordion={error || categories.length === 0}>
						<div
							class="px-6 py-2 rounded-3xl bg-red-600/50 text-text-heading-dark font-semibold text-base"
						>
							{categories.length === 0 ? 'Please subscribe to at least one category feed !' : error}
						</div>
					</div>
					<!-- Save button -->
					<Button
						class="h-12 disabled:opacity-100 disabled:bg-neutral-600 relative overflow-hidden"
						onclick={saveCategories}
						disabled={categories.length === 0}
					>
						{#if !hasUnsavedChanges || categories.length === 0}
							<div
								transition:fly={{ y: '100%', duration: 400, opacity: 0 }}
								class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
							>
								Close
							</div>
						{:else}
							<div
								transition:fly={{ y: '100%', duration: 400, opacity: 0 }}
								class="flex flex-row gap-4 items-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
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
		</div>
	</div>
{/if}
