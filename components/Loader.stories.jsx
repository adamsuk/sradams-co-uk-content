import React from 'react';
import { ThemeProvider } from 'next-themes';
import Loader from './Loader';

export default {
  title: 'Components/Loader',
  component: Loader,
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light">
        <div style={{ height: '400px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

// eslint-disable-next-line react/jsx-props-no-spreading
function Template(args) {
  return <Loader {...args} />;
}

export const Light = Template.bind({});
Light.args = {};

export const Dark = Template.bind({});
Dark.decorators = [
  (Story) => (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="dark bg-gray-900" style={{ height: '400px' }}>
        <Story />
      </div>
    </ThemeProvider>
  ),
];
Dark.parameters = {
  backgrounds: { default: 'dark' },
};
