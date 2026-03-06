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
    <div>
      <br />
      <form>
        <div>{title}</div>
        <input type="text" name={inputName} onChange={storeUserAnswer} />
      </form>
      <br />
      <button type="button" onClick={renderNextQuestion}>
        Next
      </button>
      <br />
    </div>
  );
}

export default FormText;
