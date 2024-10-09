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
  <div
    class="fixed inset-0 z-20 backdrop-blur-md"
    transition:fade={{ duration: 500 }}
  ></div>

  <!-- Article card -->
  <div
    class="fixed inset-2 z-20 flex max-h-screen flex-col items-center justify-center md:p-4"
    transition:fly={{ y: '100%', duration: 500 }}
  >
    <div
      class={cn(
        'relative flex max-h-full w-full max-w-screen-md flex-col items-start justify-start rounded-3xl p-6',
        containerClasses
      )}
      style="background-color: #{color};"
    >
      {@render children()}
    </div>
  </div>
{/if}
