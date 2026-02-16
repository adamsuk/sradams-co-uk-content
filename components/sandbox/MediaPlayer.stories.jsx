import React from 'react';
import MediaPlayer from './MediaPlayer';

export default {
  title: 'Components/Sandbox/MediaPlayer',
  component: MediaPlayer,
  parameters: {
    layout: 'centered',
  },
};

// eslint-disable-next-line react/jsx-props-no-spreading
function Template(args) {
  return <MediaPlayer {...args} />;
}

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  docs: {
    description: {
      story: 'Note: This component requires a backend API at http://localhost:3001/all-podcasts to function properly.',
    },
  },
};
