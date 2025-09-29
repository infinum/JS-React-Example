import { defineConfig } from '@playwright/test';
import baseConfig from '../test-utils/base.playwright.config';

export default defineConfig({
	...baseConfig,
	testDir: './', // runs specs in e2e-frontend
});
