export const CUSTOM_VIEWPORTS = {
	sm: {
		name: 'Small (≥ 640 px)',
		styles: {
			width: '640px',
			height: '1000px', // large phones / small tablets
		},
		type: 'mobile',
	},
	md: {
		name: 'Medium (≥ 768 px)',
		styles: {
			width: '768px',
			height: '1024px', // iPad portrait
		},
		type: 'tablet',
	},
	lg: {
		name: 'Large (≥ 1024 px)',
		styles: {
			width: '1024px',
			height: '1366px', // iPad Pro / small laptop
		},
		type: 'desktop',
	},
	xl: {
		name: 'Extra-Large (≥ 1280 px)',
		styles: {
			width: '1280px',
			height: '800px', // 13-inch laptop
		},
		type: 'desktop',
	},
	'2xl': {
		name: '2× Large (≥ 1536 px)',
		styles: {
			width: '1536px',
			height: '960px', // 15–16″ laptop / 4 K monitor
		},
		type: 'desktop',
	},
};
