import React from 'react';
import { render } from '@testing-library/react';

import MarkdownImg from '../../components/MarkdownImg';

describe('MarkdownImg', () => {
  it('renders an img element', () => {
    const { container } = render(<MarkdownImg src="https://example.com/img.png" alt="example" />);
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('decodes literal &amp; entities in src URLs', () => {
    const url = 'https://img.shields.io/badge/foo?&amp;style=flat&amp;logo=bar';
    const expected = 'https://img.shields.io/badge/foo?&style=flat&logo=bar';

    const { container } = render(<MarkdownImg src={url} alt="foo" />);
    expect(container.querySelector('img')?.getAttribute('src')).toBe(expected);
  });

  it('strips a trailing %22 from src URLs', () => {
    const url = 'https://img.shields.io/badge/foo?&style=flat%22';
    const expected = 'https://img.shields.io/badge/foo?&style=flat';

    const { container } = render(<MarkdownImg src={url} alt="foo" />);
    expect(container.querySelector('img')?.getAttribute('src')).toBe(expected);
  });

  it('handles both &amp; entities and a trailing %22', () => {
    const url = 'https://img.shields.io/badge/foo?&amp;style=flat&amp;logo=bar%22';
    const expected = 'https://img.shields.io/badge/foo?&style=flat&logo=bar';

    const { container } = render(<MarkdownImg src={url} alt="foo" />);
    expect(container.querySelector('img')?.getAttribute('src')).toBe(expected);
  });

  it('does not modify clean src URLs', () => {
    const url = 'https://img.shields.io/badge/foo?&style=flat';

    const { container } = render(<MarkdownImg src={url} alt="foo" />);
    expect(container.querySelector('img')?.getAttribute('src')).toBe(url);
  });

  it('falls back to empty string when alt is undefined', () => {
    const { container } = render(<MarkdownImg src="https://example.com/img.png" />);
    expect(container.querySelector('img')?.getAttribute('alt')).toBe('');
  });

  it('handles undefined src gracefully', () => {
    const { container } = render(<MarkdownImg alt="foo" />);
    expect(container.querySelector('img')?.getAttribute('src')).toBeNull();
  });
});
