/**
 * Array of accessibility rules to check for violations.
 * Add / Remove rules to customize the accessibility scan scope.
 * @see https://playwright.dev/docs/accessibility-testing#scanning-for-wcag-violations
 */
export const a11yRules: string[] = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];

export type A11yRule = (typeof a11yRules)[number];
