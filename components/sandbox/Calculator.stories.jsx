import React from 'react';
import Calculator from './Calculator';

export default {
  title: 'Components/Sandbox/Calculator',
  component: Calculator,
  parameters: {
    layout: 'centered',
  },
};

// eslint-disable-next-line react/jsx-props-no-spreading
function Template(args) {
  return <Calculator {...args} />;
}

export const Default = Template.bind({});
Default.args = {};
