<script>
	import { CARDS_COLORS } from '$lib/constants';
	import { fade, fly } from 'svelte/transition';
	import { cn } from '$lib/utils';

	let {
		open = $bindable(false),
		children,
		color = CARDS_COLORS[0],
		containerClasses,
		dismissible = true
	} = $props();
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<svelte:window
	onkeydown={(e) => {
		if (dismissible && e.key === 'Escape') open = false;
	}}
/>

{#if open}
	<!-- Backdrop -->
	<div class="backdrop-blur-md fixed inset-0 z-20" transition:fade={{ duration: 500 }}></div>

	<!-- Article card -->
	<div
		class="fixed inset-2 flex flex-col items-center justify-center max-h-screen md:p-4 z-20"
		transition:fly={{ y: '100%', duration: 500 }}
	>
		<div
			class={cn(
				'flex flex-col items-start justify-start relative w-full max-h-full max-w-screen-md rounded-3xl p-6',
				containerClasses
			)}
			style="background-color: #{color};"
		>
			{@render children()}
		</div>
	</div>
{/if}
