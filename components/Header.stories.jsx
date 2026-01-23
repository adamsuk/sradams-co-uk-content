import React from 'react';
import { ThemeProvider } from 'next-themes';
import Header from './Header';

export default {
  title: 'Components/Header',
  component: Header,
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light">
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

// eslint-disable-next-line react/jsx-props-no-spreading
function Template(args) {
  return <Header {...args} />;
}

export const Default = Template.bind({});
Default.args = {};

export const DarkMode = Template.bind({});
DarkMode.decorators = [
  (Story) => (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="dark">
        <Story />
      </div>
    </ThemeProvider>
  ),
];
DarkMode.parameters = {
  backgrounds: { default: 'dark' },
};
