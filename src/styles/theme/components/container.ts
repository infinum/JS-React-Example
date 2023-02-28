import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const sizes = {
	sm: defineStyle({
		maxW: 'container.sm',
	}),
	md: defineStyle({
		maxW: 'container.md',
	}),
	lg: defineStyle({
		maxW: 'container.lg',
	}),
	xl: defineStyle({
		maxW: 'container.xl',
	}),
};

export const containerTheme = defineStyleConfig({ sizes });
