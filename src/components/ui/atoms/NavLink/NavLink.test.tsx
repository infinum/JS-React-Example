import React from 'react';

import { NavLink } from './NavLink';
import { render } from '@test-utils';

describe('NavLink', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<NavLink />);

    expect(asFragment()).toMatchSnapshot();
  });
});