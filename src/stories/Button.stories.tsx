import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { getThemingArgTypes } from '@chakra-ui/storybook-addon';
import { Button } from '@chakra-ui/react';

import theme from '../styles/theme';

export default {
	title: 'Components / Core / Button',
	argTypes: getThemingArgTypes(theme, 'Button'),
	component: (args) => <Button {...args}>Button</Button>,
} as Meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
	args: {
		variant: 'solid',
	},
};
