---
to: src/components/ui/atoms/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.stories.tsx
---
<%
  ComponentName = h.changeCase.pascal(name)
-%>
import React, { ComponentProps } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { <%= ComponentName %> } from './<%= ComponentName %>';

export default {
  title: 'UI/Atoms/<%= ComponentName %>',
  component: <%= ComponentName %>,
} as Meta;

const Template: Story<ComponentProps<typeof <%= ComponentName %>>> = (args) => <<%= ComponentName %> {...args} />;

export const Example = Template.bind({});
Example.args = {
  /* the args you need here will depend on your component */
};
