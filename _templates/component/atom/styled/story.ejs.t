---
to: src/components/ui/atoms/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.stories.tsx
---
<%
  ComponentName = h.changeCase.pascal(name)
-%>
import React from 'react';
import { ChakraComponent } from '@chakra-ui/react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { <%= ComponentName %>, I<%= ComponentName %>Props } from './<%= ComponentName %>';

export default {
  title: 'UI/Atoms/<%= ComponentName %>',
  component: <%= ComponentName %>,
} as Meta;

const Template: Story<ChakraComponent<'div', I<%= ComponentName %>Props>> = (args) => <<%= ComponentName %> {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  /* the args you need here will depend on your component */
};

Primary.storyName = 'Example';