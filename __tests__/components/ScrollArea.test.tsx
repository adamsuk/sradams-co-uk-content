import React from 'react';
import { act, render, screen } from '@testing-library/react';

import ScrollArea from '../../components/ScrollArea';

const handlers: Record<string, Array<(url: string) => void>> = {};
const mockRouter = {
  asPath: '/blog',
  events: {
    on: (name: string, fn: (url: string) => void) => { (handlers[name] ||= []).push(fn); },
    off: (name: string, fn: (url: string) => void) => {
      handlers[name] = (handlers[name] || []).filter((item) => item !== fn);
    },
  },
};
jest.mock('next/router', () => ({ useRouter: () => mockRouter }));

function emit(name: string, url: string) {
  act(() => { (handlers[name] || []).forEach((fn) => fn(url)); });
}

describe('ScrollArea', () => {
  it('is the focusable scroll region', () => {
    render(<ScrollArea><p>Page</p></ScrollArea>);
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('tabindex', '-1');
    expect(main).toHaveClass('overflow-y-auto');
  });

  it('starts new pages at the top and restores position on back', () => {
    render(<ScrollArea><p>Page</p></ScrollArea>);
    const main = screen.getByRole('main');
    main.scrollTop = 400;
    emit('routeChangeStart', '/blog/post');
    emit('routeChangeComplete', '/blog/post');
    expect(main.scrollTop).toBe(0);
    expect(document.activeElement).toBe(main);
    mockRouter.asPath = '/blog/post';
    emit('routeChangeStart', '/blog');
    act(() => { window.dispatchEvent(new PopStateEvent('popstate')); });
    emit('routeChangeComplete', '/blog');
    expect(main.scrollTop).toBe(400);
  });

  it('scrolls to an anchor on the new page', () => {
    render(<ScrollArea><h2 id="part-two">Two</h2></ScrollArea>);
    const target = screen.getByText('Two');
    target.scrollIntoView = jest.fn();
    emit('routeChangeComplete', '/blog/post#part-two');
    expect(target.scrollIntoView).toHaveBeenCalled();
  });
});
