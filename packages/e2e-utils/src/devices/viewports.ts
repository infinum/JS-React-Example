import { ViewportSize } from '@playwright/test';

/**
 * Common viewport presets for different device types.
 */
export const viewports = {
	mobile: { width: 375, height: 812 } as ViewportSize,
	tablet: { width: 768, height: 1024 } as ViewportSize,
	desktop: { width: 1280, height: 720 } as ViewportSize,
	'desktop-large': { width: 1920, height: 1080 } as ViewportSize,
} as const;

export type ViewportPreset = keyof typeof viewports;
