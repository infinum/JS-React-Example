'use client';

import { Button } from '@infinum/ui/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@infinum/ui/components/tooltip';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

type ThemeState = 'light' | 'dark' | 'rainbow';

export const ThemeToggle = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	const { theme: rawTheme, systemTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Only after mount do we trust next-themes to give us the real class
	useEffect(() => {
		// This exact pattern is used in the React docs, Next.js docs, and next-themes docs,
		// and there are active GitHub issues saying the rule is overly strict / buggy for it.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
	}, []);

	// Default icon for initial render (server + hydration pass)
	const defaultIcon = '🌞';

	// While not mounted, render a placeholder button to avoid mismatch
	if (!mounted) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline" size="icon" {...props}>
						{defaultIcon}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Switch theme</p>
				</TooltipContent>
			</Tooltip>
		);
	}

	// Now that we're mounted, resolve the actual theme
	const resolvedTheme = rawTheme === 'system' ? (systemTheme as ThemeState) : (rawTheme as ThemeState);

	const themes: ThemeState[] = ['light', 'dark', 'rainbow'];
	const icons: Record<ThemeState, string> = {
		light: '🌞',
		dark: '🌙',
		rainbow: '🌈',
	};

	const handleSwitchTheme = () => {
		const currentIndex = themes.indexOf(resolvedTheme);
		const next = themes[(currentIndex + 1) % themes.length];
		setTheme(next);
	};

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button onClick={handleSwitchTheme} variant="outline" size="icon" {...props}>
					{icons[resolvedTheme]}
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>Switch theme</p>
			</TooltipContent>
		</Tooltip>
	);
};
