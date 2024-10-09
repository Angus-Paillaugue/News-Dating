<script>
  import { CARDS_COLORS } from '$lib/constants';
  import { Button, Modal } from '$lib/components';

  const { data } = $props();
  const { user } = data;
  const COLOR = CARDS_COLORS[0];

  let deleteAccountModalOpen = $state(false);
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<Modal bind:open={deleteAccountModalOpen} color={COLOR}>
  <h2 class="mb-4 text-lg font-semibold text-text-heading">Delete account</h2>
  <p class="text-text-body">Are you sure you want to delete your account?</p>
  <p class="text-text-body">This action is <b>irreversible</b>!</p>
  <div class="mt-2 grid w-full grid-cols-2 gap-2">
    <Button center onclick={() => (deleteAccountModalOpen = false)}
      >No, Cancel</Button
    >
    <Button center href="/app/delete-account" variant="danger"
      >Yes, Delete</Button
    >
  </div>
</Modal>

<div
  class="relative flex h-full grow flex-col items-center overflow-hidden p-2 pt-10"
>
  <section
    class="relative flex h-full max-h-[700px] w-full max-w-md flex-col gap-4 overflow-hidden rounded-3xl p-4 text-text-body md:p-6"
    style="background-color: #{COLOR};"
  >
    <h1 class="text-2xl font-semibold text-text-heading">
      Welcome, {user.username}
    </h1>

    <Button class="w-full" href="/app/log-out">Log-out</Button>
    <Button
      class="w-full"
      variant="danger"
      onclick={() => (deleteAccountModalOpen = true)}>Delete account</Button
    >
  </section>
</div>
