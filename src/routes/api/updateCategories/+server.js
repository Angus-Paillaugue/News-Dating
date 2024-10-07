import { createConnection } from '$lib/server/db';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	const { user } = locals;
	const { categories: newCategories } = await request.json();
	const db = await createConnection();

	// Fetch initial categories
	const [initialCategories] =
		(await db.query(
			`
		SELECT c.id, c.label, c.url, c.lang
		FROM categories c
		JOIN userCategories uc ON c.id = uc.categoryId
		JOIN users u ON uc.userId = u.id
		WHERE u.id = ?;`,
			[user.id]
		)) ?? [];

	// Create sets for quicker comparisons
	const newCategorySet = new Set(newCategories);
	const initialCategorySet = new Set(initialCategories.map((category) => category.id));

	// Categories to insert (present in newCategories but not in initialCategories)
	const categoriesToInsert = [...newCategorySet].filter((id) => !initialCategorySet.has(id));

	// Categories to delete (present in initialCategories but not in newCategories)
	const categoriesToDelete = [...initialCategorySet].filter((id) => !newCategorySet.has(id));

	await db.query('START TRANSACTION;');

	try {
		// Insert new categories
		for (const categoryId of categoriesToInsert) {
			await db.query('INSERT INTO userCategories (userId, categoryId) VALUES (?, ?);', [
				user.id,
				categoryId
			]);
		}

		// Delete old categories
		for (const categoryId of categoriesToDelete) {
			await db.query('DELETE FROM userCategories WHERE userId = ? AND categoryId = ?;', [
				user.id,
				categoryId
			]);
		}

		await db.query('COMMIT;');
	} catch (error) {
		await db.query('ROLLBACK;');
		return json(
			{ success: false, message: 'Error updating categories: ' + error },
			{ status: 500 }
		);
	} finally {
		await db.end();
	}

	return json({ success: true, message: 'Categories updated successfully' }, { status: 200 });
}
