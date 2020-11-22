---
to: src/components/ui/atoms/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.test.tsx
---
<%
  ComponentName = h.changeCase.pascal(name)
-%>
import React from 'react';

import { <%= ComponentName %> } from './<%= ComponentName %>';
import { render } from '@test-utils';

describe('<%= ComponentName %>', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<<%= ComponentName %> />);

    expect(asFragment()).toMatchSnapshot();
  });
});