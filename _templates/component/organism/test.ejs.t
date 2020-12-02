---
to: src/components/ui/organisms/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.test.tsx
---
<%
  ComponentName = h.changeCase.pascal(name)
-%>
import React from 'react';
import { render, screen } from '@testing-library/react';

import { <%= ComponentName %> } from './<%= ComponentName %>';

describe('<%= ComponentName %>', () => {
  it('Is rendered', () => {
    const testMessage = '<%= ComponentName %>';

    render(<<%= ComponentName %>>{testMessage}</<%= ComponentName %>>);

    expect(screen.queryByText(testMessage)).toBeDefined();
  });
});
