import { createConnection } from '$lib/server/db';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { id } = await request.json();

	const db = await createConnection();
	await db.query('DELETE FROM bookmarks WHERE id = ?', [id]);
	db.end();

	return new Response(null, { status: 204 });
}
