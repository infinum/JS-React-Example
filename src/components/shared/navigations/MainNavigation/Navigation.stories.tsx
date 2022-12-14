import { Meta, StoryFn } from '@storybook/react';

import { MainNavigation } from './MainNavigation';

export default {
	title: 'shared/navigations/MainNavigation',
	component: MainNavigation,
} as Meta;

const Template: StoryFn = (args) => <MainNavigation {...args} />;

export const Example = Template.bind({});
Example.args = {};
