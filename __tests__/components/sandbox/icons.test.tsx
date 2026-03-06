import React from 'react';
import { render } from '@testing-library/react';

import Play from '../../../components/sandbox/icons/Play';
import Pause from '../../../components/sandbox/icons/Pause';
import Next from '../../../components/sandbox/icons/Next';
import Previous from '../../../components/sandbox/icons/Previous';
import Shuffle from '../../../components/sandbox/icons/Shuffle';

describe('Sandbox icon components', () => {
  it('Play renders an SVG', () => {
    const { container } = render(<Play />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('Pause renders an SVG', () => {
    const { container } = render(<Pause />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('Next renders an SVG', () => {
    const { container } = render(<Next />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('Previous renders an SVG', () => {
    const { container } = render(<Previous />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('Shuffle renders an SVG', () => {
    const { container } = render(<Shuffle />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('Play accepts SVG props', () => {
    const { container } = render(<Play width={50} height={50} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '50');
  });
});
