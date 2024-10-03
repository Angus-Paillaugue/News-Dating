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

		// Check if user exists
		const [userExistsUsername] = await db.query(
			'SELECT * FROM users WHERE username = ?',
			[username]
		);
		if (!userExistsUsername || userExistsUsername.username !== username) {
			return { success: false, message: 'No account with this username!' };
		}
		const user = userExists[0];
		const compare = await bcrypt.compare(password, user.passwordHash);
		if (compare) {
			cookies.set('token', generateAccessToken(username), {
				path: '/',
				maxAge: 60 * 60 * 24,
				secure: false
			});
			throw redirect(307, '/');
		}
		return { success: false, message: 'Incorrect password!' };
	}
};

function generateAccessToken(username) {
	return jwt.sign(username, AUTH_TOKEN_SECRET);
}
