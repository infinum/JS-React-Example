---
to: src/components/ui/atoms/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.test.tsx
---
<%
  pascalName = h.changeCase.pascal(name)
-%>
import React from 'react';
import { render, screen } from '@testing-library/react';

import { <%= pascalName %> } from './<%= pascalName %>';

describe('<%= pascalName %>', () => {
  it('Is rendered', () => {
    const testMessage = '<%= pascalName %>';

    render(<<%= pascalName %>>{testMessage}</<%= pascalName %>>);

    expect(screen.queryByText(testMessage)).toBeDefined();
  });
});
