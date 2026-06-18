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