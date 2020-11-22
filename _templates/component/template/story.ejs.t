---
to: src/components/ui/templates/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.stories.tsx
---
<%
  ComponentName = h.changeCase.pascal(name)
  ComponentNameHeader = h.changeCase.pascal(name) + 'Header'
  ComponentNameContent = h.changeCase.pascal(name) + 'Content'
  ComponentNameFooter = h.changeCase.pascal(name) + 'Footer'
-%>
import React, { FC } from 'react';

import { <%= ComponentName %>, <%= ComponentNameHeader %>, <%= ComponentNameContent %>, <%= ComponentNameFooter %> } from './<%= ComponentName %>';

export default {
  title: 'UI/Templates/<%= ComponentName %>',
};

export const Example: FC = () => (
  <<%= ComponentName %>>
    <<%= ComponentNameHeader %>>header</<%= ComponentNameHeader %>>
    <<%= ComponentNameContent %>>content</<%= ComponentNameContent %>>
    <<%= ComponentNameFooter %>>footer</<%= ComponentNameFooter %>>
  </<%= ComponentName %>>
);