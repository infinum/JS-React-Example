---
to: src/components/ui/atoms/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.story.tsx
---
<%
  pascalName = h.changeCase.pascal(name)
-%>
import React, { FC } from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import { <%= pascalName %> } from './<%= pascalName %>';

export default {
  title: '<%= pascalName %>',
  decorators: [withKnobs],
};

export const example: FC = () => <<%= pascalName %>><%= pascalName %></<%= pascalName %>>;
