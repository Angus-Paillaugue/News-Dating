import { createConnection } from '$lib/server/db';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { user } = locals;
	const db = await createConnection();
	const [bookmarks] = await db.query(
		'SELECT * FROM bookmarks WHERE userId = ? ORDER BY date DESC',
		[user.id]
	);
	const [categories] = await db.query(
		`
		SELECT
    	p.id,
			p.name,
			p.previewTitleSelector,
			p.previewUrlSelector,
			p.previewDescriptionSelector,
			p.previewDateSelector,
			p.previewImgSelector,
			p.articleContentContainerSelector,
			p.articleContentExcludeSelector,
    	JSON_ARRAYAGG(
        JSON_OBJECT(
					'id', c.id,
					'label', c.label,
					'url', c.url,
					'lang', c.lang
        )
    	) AS categories
		FROM
				providers p
		JOIN
				categories c ON c.providerId = p.id
		JOIN
				userCategories uc ON c.id = uc.categoryId
		JOIN
				users u ON uc.userId = u.id
		WHERE
				u.id = ?
		GROUP BY
			p.id,
			p.name,
			p.previewTitleSelector,
			p.previewUrlSelector,
			p.previewDescriptionSelector,
			p.previewDateSelector,
			p.previewImgSelector,
			p.articleContentContainerSelector,
			p.articleContentExcludeSelector
	`,
		[user.id]
	);
	const [allCategories] = await db.query(`
		SELECT
			p.id,
			p.name,
			p.previewTitleSelector,
			p.previewUrlSelector,
			p.previewDescriptionSelector,
			p.previewDateSelector,
			p.previewImgSelector,
			p.articleContentContainerSelector,
			p.articleContentExcludeSelector,
			JSON_ARRAYAGG(
        JSON_OBJECT(
					'id', c.id,
					'label', c.label,
					'url', c.url,
					'lang', c.lang
        )
    	) AS categories
		FROM
    	providers p
		JOIN
			categories c ON c.providerId = p.id
		GROUP BY
			p.id
	`);
	db.end();

	return { bookmarks, categories, allCategories };
}
