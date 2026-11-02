import { ViewportSize } from '@playwright/test';

/**
 * Common viewport presets for different device types.
 */
export const viewports = {
	mobile: { width: 375, height: 812 },
	tablet: { width: 768, height: 1024 },
	desktop: { width: 1280, height: 720 },
	'desktop-large': { width: 1920, height: 1080 },
} as const satisfies Record<string, ViewportSize>;

export type ViewportPreset = keyof typeof viewports;
