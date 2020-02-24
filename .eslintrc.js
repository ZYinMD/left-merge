module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
		'plugin:jest/recommended', // without it, "describe" etc will be undefined. (unless I set "jest" in env?)
	],
	plugins: ['jest'],
	env: {
		browser: true,
		node: true,
		jest: true,
		es2020: true,
	},
	rules: {
		'@typescript-eslint/no-explicit-any': [0],
		'@typescript-eslint/no-use-before-define': ['error', { functions: false }],
		'@typescript-eslint/explicit-function-return-type': [0],
		'@typescript-eslint/no-var-requires': [0],
	},
};
