import React from 'react';

import { Section } from './Section';
import { render } from '@test-utils';

describe('Section', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Section />);

    expect(asFragment()).toMatchSnapshot();
  });
});