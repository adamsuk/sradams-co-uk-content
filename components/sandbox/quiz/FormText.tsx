import React from 'react';

interface QuestionProps {
  inputName: string;
  title: string;
}

interface FormTextProps {
  questionProps: QuestionProps;
  renderNextQuestion: () => void;
  output?: Record<string, string>;
  setOutput?: ((output: Record<string, string>) => void) | null;
}

function FormText({
  questionProps: { inputName, title }, renderNextQuestion, output = {}, setOutput,
}: FormTextProps) {
  const storeUserAnswer = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (setOutput) {
      setOutput({
        ...output,
        [inputName]: event.target.value,
      });
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        renderNextQuestion();
      }}
    >
      <label htmlFor={inputName} className="block text-lg font-medium">
        {title}
      </label>
      <input
        id={inputName}
        type="text"
        name={inputName}
        value={output[inputName] || ''}
        onChange={storeUserAnswer}
        className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
      />
      <button
        type="submit"
        className="mt-4 rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white dark:bg-white dark:text-gray-900"
      >
        Next
      </button>
    </form>
  );
}

export default FormText;
