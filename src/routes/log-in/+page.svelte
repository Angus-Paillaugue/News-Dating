<script>
	import { enhance } from '$app/forms';
	import Spinner from '$lib/components/Spinner.svelte';
	import { CARDS_COLORS } from '$lib/constants';

	const { form } = $props();
	let isSendingForm = $state(false);
</script>

<svelte:head>
	<title>Log-in</title>
</svelte:head>

<div class="pt-10 flex flex-col items-center justify-center p-2">
	<form
		class="max-w-md w-full rounded-3xl p-6 flex flex-col gap-6 text-text-heading"
		style="background-color: #{CARDS_COLORS[Math.floor(Math.random() * CARDS_COLORS.length)]};"
		method="POST"
		use:enhance={() => {
			isSendingForm = true;
			return async ({ update }) => {
				await update();
				isSendingForm = false;
			};
		}}
	>
		<h1 class="text-inherit text-3xl font-bold">Log-in</h1>
		<input
			type="text"
			class="px-6 py-3 text-base font-medium rounded-full bg-neutral-800 w-full text-text-heading-dark placeholder:text-text-body focus:outline-0 outline-0"
			name="username"
			placeholder="Username"
		/>
		<input
			type="password"
			class="px-6 py-3 text-base font-medium rounded-full bg-neutral-800 w-full text-text-heading-dark placeholder:text-text-body focus:outline-0 outline-0"
			name="password"
			placeholder="Password"
		/>

		<button
			disabled={isSendingForm}
			type="submit"
			class="flex flex-row items-center justify-center text-lg font-medium gap-2 w-full px-4 py-2 bg-neutral-800 rounded-full text-text-heading-dark disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{#if isSendingForm}
				<Spinner />
			{/if}
			Log-in
		</button>

		{#if form?.success == false}
			<div class="px-6 py-2 rounded-full bg-red-600 text-neutral-100 font-semibold text-base">
				{form.message}
			</div>
		{/if}
	</form>
</div>
