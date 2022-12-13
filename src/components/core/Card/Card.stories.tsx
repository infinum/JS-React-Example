import React, { ComponentProps } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Card } from './Card';

export default {
	title: 'UI/core/Card',
	component: Card,
} as Meta;

const Template: Story<ComponentProps<typeof Card>> = (args) => <Card {...args} />;

export const Basic = Template.bind({});
Basic.args = {
	/* the args you need here will depend on your component */
};
