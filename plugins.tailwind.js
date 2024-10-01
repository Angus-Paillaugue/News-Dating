import plugin from 'tailwindcss/plugin';

export const textWrapPlugin = plugin(({ addUtilities }) => {
	addUtilities({
		'.text-wrap-none': {
			textWrap: 'none'
		},
		'.text-wrap-balance': {
			textWrap: 'balance'
		}
	});
});
