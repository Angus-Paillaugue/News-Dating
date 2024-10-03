import { createConnection } from '$lib/server/db';
import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { user } = locals;
	const { id } = user;
	const db = await createConnection();
	await db.query('DELETE FROM userCategories WHERE userId = ?', [id]);
	await db.query('DELETE FROM users WHERE id = ?', [id]);
	await db.query('DELETE FROM bookmarks WHERE userId = ?', [id]);
	db.end();

	throw redirect(303, '/log-in');
}
