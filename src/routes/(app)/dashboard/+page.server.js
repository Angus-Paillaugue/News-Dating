/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  const { user } = locals;
	return { user  };
}
