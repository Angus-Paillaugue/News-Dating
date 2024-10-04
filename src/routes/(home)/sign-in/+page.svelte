<script>
	import { enhance } from '$app/forms';
	import Spinner from '$lib/components/Spinner.svelte';
	import { CARDS_COLORS } from '$lib/constants';
	import Button from '$lib/components/Button.svelte';

	const { form } = $props();
	let isSendingForm = $state(false);
</script>

<svelte:head>
	<title>Log-in</title>
</svelte:head>

<div class="bg-body-dark rounded-3xl w-full p-4 h-[calc(100vh-85px)] flex flex-col items-center justify-center relative">
	<form
		class="max-w-md w-full rounded-3xl p-6 flex flex-col gap-6 text-text-heading"
		style="background-color: #{CARDS_COLORS[2]};"
		method="POST"
		use:enhance={() => {
			isSendingForm = true;
			return async ({ update }) => {
				await update();
				isSendingForm = false;
			};
		}}
	>
		<h1 class="text-inherit text-3xl font-bold">Sign-in</h1>
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

		<Button disabled={isSendingForm} type="submit">
			{#if isSendingForm}
				<Spinner />
			{/if}
			Sign-in
		</Button>

		{#if form?.error}
			<div class="px-6 py-2 rounded-full bg-red-600 text-text-heading-dark font-semibold text-base">
				{form.error}
			</div>
		{/if}

		<a href="/log-in" class="text-text-body underline underline-offset-2">Already an account ?</a>
	</form>
</div>
