import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import SideBar from '../../components/SideBar';

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    query: {},
    pathname: '/',
    isReady: true,
  }),
}));

jest.mock('react-icons/vsc', () => ({
  VscClose: ({ onClick }: { onClick: () => void }) => (
    <button type="button" data-testid="close-btn" onClick={onClick}>Close</button>
  ),
  VscChevronRight: ({ onClick }: { onClick: () => void }) => (
    <button type="button" data-testid="open-btn-lg" onClick={onClick}>Open</button>
  ),
  VscChevronDown: ({ onClick }: { onClick: () => void }) => (
    <button type="button" data-testid="open-btn-sm" onClick={onClick}>Open</button>
  ),
}));

const mockItems = [
  { title: 'Item One', slug: 'item-one' },
  { title: 'Item Two', slug: 'item-two' },
  { title: 'Item Three', slug: 'item-three' },
];

function MockSidebarItem({ item }: { item: { title: string } }) {
  return <span>{item.title}</span>;
}

function MockContent({ index, items }: { index: number; items: typeof mockItems }) {
  return (
    <div data-testid="content">
      Content for:
      {items[index].title}
    </div>
  );
}

describe('SideBar', () => {
  beforeEach(() => {
    mockPush.mockClear();
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 768 });
  });

  it('renders all sidebar items', () => {
    render(
      <SideBar sidebarItems={mockItems} SidebarItem={MockSidebarItem} error={false}>
        {MockContent}
      </SideBar>,
    );
    expect(screen.getByText('Item One')).toBeInTheDocument();
    expect(screen.getByText('Item Two')).toBeInTheDocument();
    expect(screen.getByText('Item Three')).toBeInTheDocument();
  });

  it('renders the child content for the default index', () => {
    render(
      <SideBar sidebarItems={mockItems} SidebarItem={MockSidebarItem} error={false}>
        {MockContent}
      </SideBar>,
    );
    expect(screen.getByTestId('content')).toHaveTextContent('Content for: Item One');
  });

  it('renders content for a custom initial index', () => {
    render(
      <SideBar sidebarItems={mockItems} SidebarItem={MockSidebarItem} error={false} index={1}>
        {MockContent}
      </SideBar>,
    );
    expect(screen.getByTestId('content')).toHaveTextContent('Content for: Item Two');
  });

  it('changes content when a sidebar item is clicked', () => {
    render(
      <SideBar sidebarItems={mockItems} SidebarItem={MockSidebarItem} error={false}>
        {MockContent}
      </SideBar>,
    );
    fireEvent.click(screen.getByText('Item Three'));
    expect(screen.getByTestId('content')).toHaveTextContent('Content for: Item Three');
  });

  it('hides sidebar items when close button is clicked', () => {
    render(
      <SideBar sidebarItems={mockItems} SidebarItem={MockSidebarItem} error={false}>
        {MockContent}
      </SideBar>,
    );
    fireEvent.click(screen.getByTestId('close-btn'));
    expect(screen.queryByText('Item One')).not.toBeInTheDocument();
  });

  it('shows re-open button after sidebar is closed', () => {
    render(
      <SideBar sidebarItems={mockItems} SidebarItem={MockSidebarItem} error={false}>
        {MockContent}
      </SideBar>,
    );
    fireEvent.click(screen.getByTestId('close-btn'));
    expect(screen.getByTestId('open-btn-lg')).toBeInTheDocument();
  });

  it('redirects to /404 when error prop is true', () => {
    render(
      <SideBar sidebarItems={mockItems} SidebarItem={MockSidebarItem} error>
        {MockContent}
      </SideBar>,
    );
    expect(mockPush).toHaveBeenCalledWith('/404');
  });

  it('calls changeRouting when provided and an item is clicked', () => {
    const changeRouting = jest.fn();
    render(
      <SideBar
        sidebarItems={mockItems}
        SidebarItem={MockSidebarItem}
        error={false}
        changeRouting={changeRouting}
      >
        {MockContent}
      </SideBar>,
    );
    fireEvent.click(screen.getByText('Item Two'));
    expect(changeRouting).toHaveBeenCalledWith({ index: 1, items: mockItems });
  });
});
