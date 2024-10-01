import { createConnection } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AUTH_TOKEN_SECRET } from '$env/static/private';

export const actions = {
	default: async ({ cookies, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const { username, password } = formData;
		let userExists = [];
		const db = await createConnection();
		try {
			[userExists] = await db.query('SELECT * FROM `users` WHERE `username` = ? LIMIT 1;', [
				username
			]);
		} catch (err) {
			console.log(err);
			return { success: false, message: err?.code ?? err.toString() };
		} finally {
			db.end();
		}

		if (userExists.length === 0)
			return { success: false, message: 'No account with this username!' };

		const user = userExists[0];
		const compare = await bcrypt.compare(password, user.passwordHash);
		if (compare) {
			cookies.set('token', generateAccessToken(username), { path: '/', sameSite: 'strict' });
			throw redirect(307, '/');
		}
		return { success: false, message: 'Incorrect password!' };
	}
};

function generateAccessToken(username) {
	return jwt.sign(username, AUTH_TOKEN_SECRET);
}
