/** @type {import('tailwindcss').Config} */
export default {
	content: ['./**/*.{html,js,svelte,md,svx,mdx}', '!./node_modules/**'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Poppins'],
				mono: ['JetBrains Mono']
			},
			colors: {
				primary: {
					50: 'rgb(255, 249, 237)',
					100: 'rgb(254, 242, 214)',
					200: 'rgb(252, 224, 172)',
					300: 'rgb(249, 201, 120)',
					400: 'rgb(247, 177, 85)',
					500: 'rgb(243, 141, 28)',
					600: 'rgb(228, 115, 18)',
					700: 'rgb(189, 87, 17)',
					800: 'rgb(150, 69, 22)',
					900: 'rgb(121, 58, 21)',
					950: 'rgb(65, 28, 9)'
				},
				'text-body': {
					DEFAULT: 'theme(colors.neutral.500)',
					dark: 'theme(colors.neutral.400)'
				},
				'text-heading': {
					DEFAULT: 'theme(colors.neutral.900)',
					dark: 'theme(colors.neutral.100)'
				},
				body: {
					DEFAULT: 'theme(colors.white)',
					dark: 'theme(colors.neutral.950)'
				}
			},
			borderColor: {
				main: {
					DEFAULT: 'theme(colors.neutral.300/50)',
					dark: 'theme(colors.neutral.800)'
				}
			},
			transitionTimingFunction: {
				'back-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)'
			}
		}
	}
};
