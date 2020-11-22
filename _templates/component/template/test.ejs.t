---
to: src/components/ui/templates/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.test.tsx
---
<%
  ComponentName = h.changeCase.pascal(name)
  ComponentNameHeader = h.changeCase.pascal(name) + 'Header'
  ComponentNameContent = h.changeCase.pascal(name) + 'Content'
  ComponentNameFooter = h.changeCase.pascal(name) + 'Footer'
-%>
import React from 'react';

import { <%= ComponentName %>, <%= ComponentNameHeader %>, <%= ComponentNameContent %>, <%= ComponentNameFooter %> } from './<%= ComponentName %>';
import { render } from '@test-utils';

describe('<%= ComponentName %>', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <<%= ComponentName %>>
        <<%= ComponentNameHeader %>>header</<%= ComponentNameHeader %>>
        <<%= ComponentNameContent %>>content</<%= ComponentNameContent %>>
        <<%= ComponentNameFooter %>>footer</<%= ComponentNameFooter %>>
      </<%= ComponentName %>>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});