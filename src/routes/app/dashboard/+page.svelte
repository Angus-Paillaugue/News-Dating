<script>
	import { CARDS_COLORS } from '$lib/constants';
	import { Button } from '$lib/components';
	import { fade, fly } from 'svelte/transition';

	const { data } = $props();
	const { user } = data;
	const COLOR = CARDS_COLORS[0];

	let deleteAccountModalOpen = $state(false);
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

{#if deleteAccountModalOpen}
	<!-- Backdrop -->
	<div
		class="backdrop-blur-md fixed inset-0"
		style="z-index: 9999;"
		transition:fade={{ duration: 500 }}
	></div>

	<!-- Article card -->
	<div
		class="fixed inset-0 flex flex-col items-center justify-center md:p-4"
		style="z-index: 10000;"
		transition:fly={{ y: '100%', duration: 500 }}
	>
		<div
			class="flex flex-col items-start justify-start relative w-full max-w-screen-md md:rounded-3xl p-6"
			style="background-color: #{COLOR};"
		>
			<h2 class="text-lg font-semibold mb-4 text-text-heading">Delete account</h2>
			<p class="text-text-body">Are you sure you want to delete your account?</p>
			<p class="text-text-body">This action is <b>irreversible</b>!</p>
			<div class="mt-2 grid w-full grid-cols-2 gap-2">
				<Button center onclick={() => (deleteAccountModalOpen = false)}>No, Cancel</Button>
				<Button center href="/app/delete-account" style="danger">Yes, Delete</Button>
			</div>
		</div>
	</div>
{/if}

<div
	class="h-full grow flex flex-col pt-10 overflow-hidden p-2 items-center relative"
>
	<section
		class="text-text-body rounded-3xl overflow-hidden max-w-md max-h-[700px] relative w-full h-full p-4 md:p-6 flex flex-col gap-4"
		style="background-color: #{COLOR};"
	>
		<h1 class="text-text-heading text-2xl font-semibold">Welcome, {user.username}</h1>

		<Button class="w-full" href="/app/log-out">Log-out</Button>
		<Button class="w-full" style="danger" onclick={() => (deleteAccountModalOpen = true)}
			>Delete account</Button
		>
	</section>
</div>
