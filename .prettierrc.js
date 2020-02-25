module.exports = {
	printWidth: 100,
	trailingComma: 'all',
	singleQuote: true,
	useTabs: true,
	overrides: [
		{
			files: '*.md',
			options: {
				useTabs: false,
			},
		},
	],
};
