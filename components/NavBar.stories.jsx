import React from 'react';
import NavBar from './NavBar';

export default {
  title: 'Components/NavBar',
  component: NavBar,
  parameters: {
    layout: 'fullscreen',
  },
};

// eslint-disable-next-line react/jsx-props-no-spreading
function Template(args) {
  return <NavBar {...args} />;
}

export const Default = Template.bind({});
Default.args = {};

export const WithClassName = Template.bind({});
WithClassName.args = {
  className: 'fixed bottom-0',
};
