// Config for `pnpm links:check` only — NOT for `pnpm remark:fix`.
//
// These plugins are checks, not formatters. remark-lint-no-dead-urls makes a network
// request per external link, so it must never run in the PostToolUse hook: it would
// make every edit slow and fail offline. Keep it in this separate config.
//
// gfm and frontmatter are repeated from .remarkrc.yml because --rc-path replaces the
// base config rather than extending it. Without them, links inside tables are missed
// and frontmatter is parsed as body text.
export default {
	plugins: [
		'remark-gfm',
		'remark-frontmatter',

		// Internal links: relative paths, and headings referenced by anchor.
		// `repository: false` because this repository has no git remote — without it the
		// plugin tries to resolve links against an origin URL and errors on every file.
		['remark-validate-links', { repository: false }],

		// External links.
		//
		// Read the results, do not just count them. A 404 is real rot and the citation must
		// be fixed. A 403, a 429 or a network error usually means the host blocks automated
		// requests — the link is unverified, not dead, and needs a human to open it. A
		// "redirecting URL" warning means the cited address moved: cite the final URL, since
		// a redirect today can become a 404 tomorrow.
		//
		// `skipUrlPatterns` is for hosts that can never be checked anonymously. Keep it
		// short: every pattern added here is rot that will no longer be caught.
		[
			'remark-lint-no-dead-urls',
			{
				skipUrlPatterns: [
					// Credentialed. These always answer 401/403 to an anonymous request, which
					// says nothing about whether the document exists.
					'^https?://docs\\.google\\.com',
					'^https?://drive\\.google\\.com',
					// npm package pages block automated requests with a 403. registry.npmjs.org
					// is the API and answers normally — cite that when the content allows.
					'^https?://(www\\.)?npmjs\\.com/package/',
					// Rate-limiting or bot-blocking hosts: a 403 here is not a dead link.
					'^https?://(www\\.)?linkedin\\.com',
					'^https?://(www\\.)?x\\.com',
					'^https?://twitter\\.com',
				],
			},
		],
	],
};
