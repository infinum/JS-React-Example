import React from 'react';

import { Card } from './Card';
import { render } from '@test-utils';

describe('Card', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Card />);

    expect(asFragment()).toMatchSnapshot();
  });
});