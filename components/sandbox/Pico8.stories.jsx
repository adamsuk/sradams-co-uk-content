import React from 'react';
import Pico8 from './Pico8';

export default {
  title: 'Components/Sandbox/Pico8',
  component: Pico8,
  parameters: {
    layout: 'fullscreen',
  },
};

function Template(args) {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Pico8 {...args} />
    </div>
  );
}

export const Default = Template.bind({});
Default.args = {};
