import { createConnection } from './db';
import jwt from 'jsonwebtoken';
import { AUTH_TOKEN_SECRET } from '$env/static/private';

async function auth(token) {
	try {
		return new Promise((resolve, reject) => {
			if (!token) reject({ error: 'jwt must be provided' });
			jwt.verify(token, AUTH_TOKEN_SECRET, async (err, username) => {
				if (err) return reject({ error: err });
				const db = await createConnection();
				const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
				db.end();
				if (rows.length === 0) return reject({ error: 'User not found' });
				resolve((({ passwordHash, ...o }) => o)(rows[0]));
			});
		}).catch((err) => {
			return { error: err };
		});
	} catch (err) {
		return { error: err };
	}
}

export { auth };
