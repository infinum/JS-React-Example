'use client';

import { ThemeProvider as ThemeProviderBase } from 'next-themes';
import { PropsWithChildren } from 'react';

export type AppTheme = 'light' | 'dark' | 'rainbow' | 'system';

interface ThemeProviderProps extends PropsWithChildren {}

export const ThemeProvider = ({ children }: ThemeProviderProps) => (
	<ThemeProviderBase
		attribute="class"
		defaultTheme="system"
		enableSystem
		disableTransitionOnChange
		themes={['light', 'dark', 'rainbow', 'system']}
	>
		{children}
	</ThemeProviderBase>
);
