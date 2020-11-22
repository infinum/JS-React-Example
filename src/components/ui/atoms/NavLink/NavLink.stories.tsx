import React, { ComponentProps } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { NavLink } from './NavLink';

export default {
  title: 'UI/Atoms/NavLink',
  component: NavLink,
} as Meta;

const Template: Story<ComponentProps<typeof NavLink>> = (args) => <NavLink {...args} />;

export const Example = Template.bind({});
Example.args = {
  /* the args you need here will depend on your component */
};
