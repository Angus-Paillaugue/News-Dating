<script>
  import { enhance } from '$app/forms';
  import { CARDS_COLORS } from '$lib/constants';
  import { Button, Spinner } from '$lib/components';
  import { EyeOpen, EyeClosed } from '$lib/components/icons';
  import { scale } from 'svelte/transition';

  const { form } = $props();
  let isSendingForm = $state(false);
  let passwordVisible = $state(false);
</script>

<svelte:head>
  <title>Log-in</title>
</svelte:head>

<div
  class="relative flex h-screen w-full flex-col items-center justify-center gap-10 p-4"
>
  <form
    class="flex w-full max-w-md flex-col gap-6 rounded-2xl p-6 text-text-heading"
    style="background-color: #{CARDS_COLORS[3]};"
    method="POST"
    use:enhance={() => {
      isSendingForm = true;
      return async ({ update }) => {
        await update();
        isSendingForm = false;
      };
    }}
  >
    <h1 class="text-3xl font-bold text-inherit">Log-in</h1>
    <input
      type="text"
      class="h-12 w-full rounded-full bg-neutral-800 px-6 py-3 text-base font-medium text-text-heading-dark outline-0 placeholder:text-text-body focus:outline-0"
      name="username"
      placeholder="Username"
    />
    <div class="relative flex flex-row">
      <input
        type={passwordVisible ? 'text' : 'password'}
        class="h-12 w-full rounded-l-full bg-neutral-800 px-6 py-3 text-base font-medium text-text-heading-dark outline-0 placeholder:text-text-body focus:outline-0"
        name="password"
        placeholder="Password"
      />
      <img src="/password-input-end.svg" alt="" class="-ml-px h-12" />
      <button
        class="absolute right-2 top-2 h-8 w-8 rounded-full bg-white p-1 text-neutral-800"
        type="button"
        onclick={() => (passwordVisible = !passwordVisible)}
      >
        {#if passwordVisible}
          <span in:scale>
            <EyeOpen class="size-full" />
          </span>
        {:else}
          <span in:scale>
            <EyeClosed class="size-full" />
          </span>
        {/if}
      </button>
    </div>

    {#if form?.error}
      <div
        class="rounded-full bg-red-600 px-6 py-2 text-base font-semibold text-text-heading-dark"
      >
        {form?.error}
      </div>
    {/if}

    <Button disabled={isSendingForm} type="submit">
      {#if isSendingForm}
        <Spinner />
      {/if}
      Log-in
    </Button>
  </form>

  <div
    class="flex w-full max-w-md flex-row items-center justify-center gap-2 rounded-2xl py-4 text-sm"
    style="background-color: #{CARDS_COLORS[0]};"
  >
    <p class="text-text-body">No account yet ?</p>
    <Button
      variant="link"
      href="/sign-in"
      class="font-semibold text-text-heading">Create one</Button
    >
  </div>
</div>
