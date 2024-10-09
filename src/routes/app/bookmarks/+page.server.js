import { createConnection } from '$lib/server/db';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
  const { user } = locals;
  const db = await createConnection();
  const [rows] = await db.query(
    'SELECT * FROM bookmarks WHERE userId = ? ORDER BY date DESC;',
    [user.id]
  );
  db.end();

  return { bookmarks: rows };
}
