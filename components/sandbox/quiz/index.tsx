import React, { useState } from 'react';

import FormText from './FormText';
import questions from './questions.json';

const { firstQuestion, questionSet } = questions as {
  firstQuestion: string;
  questionSet: Record<string, Question>;
};

interface NextQuestion {
  default?: string;
  exact_answer?: Record<string, string>;
}

interface Question {
  title: string;
  inputName: string;
  component: string;
  nextQuestion?: NextQuestion;
}

const questionComponents: Record<string, React.ComponentType<{
  questionProps: { inputName: string; title: string };
  renderNextQuestion: () => void;
  output?: Record<string, string>;
  setOutput?: ((output: Record<string, string>) => void) | null;
}>> = {
  FormText,
};

interface QuizProps {
  sandbox?: Record<string, string>;
  setSandbox?: ((output: Record<string, string>) => void) | null;
  nextQuestion?: string;
}

function Quiz({ sandbox = {}, setSandbox = null, nextQuestion }: QuizProps) {
  const [question, setQuestion] = useState(nextQuestion || firstQuestion);
  const current = questionSet[question];
  const QuestionComponent = questionComponents[current.component] || FormText;

  const goNext = () => {
    const next = current.nextQuestion;
    if (!next) return;
    const answer = sandbox[current.inputName]?.trim().toLowerCase();
    if (answer && next.exact_answer?.[answer]) {
      setQuestion(next.exact_answer[answer]);
      return;
    }
    if (next.default) {
      setQuestion(next.default);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-gray-50 px-5 py-6 dark:border-gray-700 dark:bg-gray-900/40">
      <QuestionComponent
        questionProps={current}
        renderNextQuestion={goNext}
        output={sandbox}
        setOutput={setSandbox}
      />
    </div>
  );
}

export default Quiz;
