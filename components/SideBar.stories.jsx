import React from 'react';
import PropTypes from 'prop-types';
import SideBar from './SideBar';

export default {
  title: 'Components/SideBar',
  component: SideBar,
  parameters: {
    layout: 'fullscreen',
  },
};

const mockItems = [
  { title: 'Item 1', description: 'First item description' },
  { title: 'Item 2', description: 'Second item description' },
  { title: 'Item 3', description: 'Third item description' },
];

function MockSidebarItem({ item }) {
  return (
    <div>
      <h3 className="font-bold">{item.title}</h3>
      <p>{item.description}</p>
    </div>
  );
}

MockSidebarItem.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

// eslint-disable-next-line react/jsx-props-no-spreading
function Template(args) {
  return <SideBar {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  sidebarItems: mockItems,
  SidebarItem: MockSidebarItem,
  children: ({ index, items }) => {
    const item = items[index];
    return () => (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
        <p>{item.description}</p>
      </div>
    );
  },
};

export const WithMultipleItems = Template.bind({});
WithMultipleItems.args = {
  sidebarItems: [
    ...mockItems,
    { title: 'Item 4', description: 'Fourth item description' },
    { title: 'Item 5', description: 'Fifth item description' },
  ],
  SidebarItem: MockSidebarItem,
  children: ({ index, items }) => {
    const item = items[index];
    return () => (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
        <p>{item.description}</p>
      </div>
    );
  },
};
