// /** @type {import('tailwindcss').Config} */
// export default {
// 	content: [
// 		"./index.html",
// 		"./src/**/*.{js,ts,jsx,tsx}",
// 	],
// 	darkMode: 'class',
// 	theme: {
// 		extend: {
// 			fontFamily: {
// 				sans: [
// 					'Lexend',
// 					'Segoe UI',
// 					'sans-serif'
// 				],
// 			},
// 		},
// 	},
// 	plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],

	darkMode: 'class',

	theme: {
		extend: {
			fontFamily: {
				sans: [
					'Lexend',
					'Inter',
					'system-ui',
					'sans-serif',
				],
			},

			colors: {
				background: '#f8f6f3',
				foreground: '#44403c',
				primary: {
					50: 'rgba(var(--color-primary-50), <alpha-value>)',
					100: 'rgba(var(--color-primary-100), <alpha-value>)',
					200: 'rgba(var(--color-primary-200), <alpha-value>)',
					300: 'rgba(var(--color-primary-300), <alpha-value>)',
					400: 'rgba(var(--color-primary-400), <alpha-value>)',
					500: 'rgba(var(--color-primary-500), <alpha-value>)',
					600: 'rgba(var(--color-primary-600), <alpha-value>)',
					700: 'rgba(var(--color-primary-700), <alpha-value>)',
					800: 'rgba(var(--color-primary-800), <alpha-value>)',
					900: 'rgba(var(--color-primary-900), <alpha-value>)',
					950: 'rgba(var(--color-primary-950), <alpha-value>)',
				}
			},

			letterSpacing: {
				tighter: '-0.03em',
			},

			boxShadow: {
				soft: '0 2px 20px rgba(0,0,0,0.04)',
			},

			borderRadius: {
				xl2: '1.25rem',
			},
		},
	},

	plugins: [],
}