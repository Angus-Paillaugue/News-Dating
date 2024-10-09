<script>
  import { page } from '$app/stores';
  import { bionicReadingEnabled, showNavbar } from '$lib/stores';
  import { cn } from '$lib/utils';
  import {
    HomeFill,
    HomeBorder,
    BookmarkFill,
    BookmarkBorder
  } from '$lib/components/icons';
  import { fly } from 'svelte/transition';
  import { backInOut } from 'svelte/easing';
  import { Button } from '$lib/components';

  let activeNavLink = $state();

  // Set the active nav link based on the current page
  page.subscribe((value) => {
    if (value.url.pathname === '/app') {
      activeNavLink = 'home';
    } else if (value.url.pathname.startsWith('/app/bookmarks')) {
      activeNavLink = 'bookmarks';
    }
  });
</script>

{#if $showNavbar}
  <div
    class="fixed bottom-2 left-1/2 z-30 -translate-x-1/2 sm:bottom-5"
    transition:fly={{ y: '92px', duration: 600, opacity: 1, easing: backInOut }}
  >
    <div class="relative flex flex-row gap-2 p-2">
      <img src="/navBg.svg" alt="" class="absolute inset-0 -z-10" />
      <Button
        href="/app"
        class={cn(
          'size-14 bg-white p-2 text-neutral-800',
          activeNavLink === 'home' && 'bg-neutral-800 text-white'
        )}
        aria-label="Home"
      >
        {#if activeNavLink === 'home'}
          <HomeFill class="size-full" />
        {:else}
          <HomeBorder class="size-full" />
        {/if}
      </Button>
      <Button
        onclick={() => {
          $bionicReadingEnabled = !$bionicReadingEnabled;
        }}
        class={cn(
          'size-14 bg-white text-neutral-800',
          $bionicReadingEnabled && 'bg-neutral-800 text-white'
        )}
        aria-label="Search"
      >
        <h1 class="text-4xl font-bold text-inherit">Br</h1>
      </Button>
      <Button
        href="/app/bookmarks"
        class={cn(
          'size-14 bg-white p-2 text-neutral-800',
          activeNavLink === 'bookmarks' && 'bg-neutral-800 text-white'
        )}
        aria-label="Bookmarks"
      >
        {#if activeNavLink === 'bookmarks'}
          <BookmarkFill class="size-full" />
        {:else}
          <BookmarkBorder class="size-full" />
        {/if}
      </Button>
    </div>
  </div>
{/if}
