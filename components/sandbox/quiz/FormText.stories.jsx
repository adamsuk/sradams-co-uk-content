import React, { useState } from 'react';
import FormText from './FormText';

export default {
  title: 'Components/Sandbox/Quiz/FormText',
  component: FormText,
  parameters: {
    layout: 'centered',
  },
};

function Template(args) {
  const [output, setOutput] = useState({});
  return (
    <div className="p-4">
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormText {...args} output={output} setOutput={setOutput} />
      <pre className="mt-4 p-2 bg-gray-100 rounded">
        {JSON.stringify(output, null, 2)}
      </pre>
    </div>
  );
}

export const Default = Template.bind({});
Default.args = {
  questionProps: {
    inputName: 'exampleAnswer',
    title: 'What is your name?',
  },
  renderNextQuestion: () => {
    // eslint-disable-next-line no-console
    console.log('Next question would be loaded here');
  },
};

export const CustomQuestion = Template.bind({});
CustomQuestion.args = {
  questionProps: {
    inputName: 'favoriteColor',
    title: 'What is your favorite color?',
  },
  renderNextQuestion: () => {
    // eslint-disable-next-line no-console
    console.log('Moving to next question...');
  },
};
