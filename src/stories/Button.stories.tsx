import type { Meta, StoryObj } from '@storybook/react';
import { getThemingArgTypes } from '@chakra-ui/storybook-addon';
import { Button } from '@chakra-ui/react';

import theme from '../styles/theme';

const meta = {
	title: 'Components / Core / Button',
	component: Button,
	argTypes: getThemingArgTypes(theme, 'Button'),
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		variant: 'solid',
		children: 'Button',
	},
};
