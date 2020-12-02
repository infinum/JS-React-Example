---
to: src/components/ui/organisms/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.stories.tsx
---
<%
  ComponentName = h.changeCase.pascal(name)
-%>
import React, { FC } from 'react';

import { <%= ComponentName %> } from './<%= ComponentName %>';

export default {
  title: 'UI/Organisms/<%= ComponentName %>',
};

export const example: FC = () => <<%= ComponentName %>><%= ComponentName %></<%= ComponentName %>>;
