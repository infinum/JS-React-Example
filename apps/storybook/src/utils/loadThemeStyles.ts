export const loadThemeStyles = () => {
	if (typeof document === 'undefined') {
		return;
	}

	const style = document.createElement('style');
	style.innerHTML = `
	/* Story canvas background */
	.docs-story,
	.sb-show-main,
	.sb-main-padded
	 {
		background-color: var(--color-background) !important;
		color: var(--color-foreground) !important;
	}

	/* Story iframe body */
	.sb-show-main iframe {
		background-color: var(--color-background) !important;
	}

	/* Storybook docs */
	.sbdocs-title,
	.sb-bar,
	.sbdocs-wrapper {
		color: var(--color-foreground) !important;
		background-color: var(--color-background) !important;
	}

	/* Argument/Props tables — the “sb-bar” row (headings) */
	.sbdocs table thead th,
	.sbdocs table tbody tr td,
	.sbdocs .docblock-argstable-head th,
	.sb-bar {
		background-color: var(--color-muted) !important;
		color: var(--color-foreground) !important;
	}

	/* Table grid lines */
	.sbdocs table,
	.sbdocs table th,
	.sbdocs table td {
		border-color: var(--color-border) !important;
	}

	/* Icons inside Docs (required flags, info icons, etc.) */
	.sbdocs svg,
	.sbdocs [class*="icon"],
	.sb-bar svg {
		color: var(--color-card-foreground) !important;
		fill: var(--color-card-foreground) !important;
	}

	/* Headings themselves */
	.sb-anchor h1,
	.sb-anchor h2,
	.sb-anchor h3,
	.sb-anchor h4,
	.sb-anchor h5,
	.sb-anchor h6 {
		color: var(--color-foreground) !important;        /* text colour */
	}
`;

	document.head.appendChild(style);
};
