import { Meta, Story } from '@storybook/react';

import { MainNavigation } from './MainNavigation';

export default {
	title: 'shared/MainNavigation',
	component: MainNavigation,
} as Meta;

const Template: Story = (args) => <MainNavigation {...args} />;

export const Example = Template.bind({});
Example.args = {};
