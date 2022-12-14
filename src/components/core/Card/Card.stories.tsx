import React, { ComponentProps } from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { Card } from './Card';

export default {
	title: 'UI/core/Card',
	component: Card,
} as Meta;

const Template: StoryFn<ComponentProps<typeof Card>> = (args) => <Card {...args} />;

export const Basic = Template.bind({});
Basic.args = {
	/* the args you need here will depend on your component */
};
