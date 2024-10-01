import mysql from 'mysql2/promise';
import { DB_PASSWORD } from '$env/static/private';

export async function createConnection(database = 'rss-news') {
	try {
		const db = await mysql.createConnection({
			host: 'localhost',
			user: 'rss-news',
			password: DB_PASSWORD,
			database: database
		});

		return db;
	} catch (e) {
		console.error('Could not connect to the database:', e);
	}
}
