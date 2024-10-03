import { createConnection } from '$lib/server/db';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	const { user } = locals;
	const { categories: newCategories } = await request.json();
	const db = await createConnection();
	const [initialCategories] = (await db.query(
		`
		SELECT c.id, c.label, c.url, c.lang
		FROM categories c
		JOIN userCategories uc ON c.id = uc.categoryId
		JOIN users u ON uc.userId = u.id
		WHERE u.id = ?;`,
		[user.id]
	)) ?? [];

	const initialCategoriesMap = new Map(initialCategories.map((c) => [c.id, c]));

	const categoriesToInsert = newCategories.filter((c) => !initialCategoriesMap.has(c.id));
	const categoriesToDelete = initialCategories.filter((c) => !newCategories.some((nc) => nc.id === c.id));

	await db.query('START TRANSACTION;');

	try {
		for (const category of categoriesToInsert) {
			await db.query('INSERT INTO userCategories (userId, categoryId) VALUES (?, ?);', [user.id, category.id]);
		}
		for (const category of categoriesToDelete) {
			await db.query('DELETE FROM userCategories WHERE userId = ? AND categoryId = ?;', [user.id, category.id]);
		}

		await db.query('COMMIT;');
	}catch (error) {
		await db.query('ROLLBACK;');
		throw error;
	}
	finally {
		await db.end();
	}

	return json({ success:true, message: 'Categories updated successfully' }, { status:200 });
}
