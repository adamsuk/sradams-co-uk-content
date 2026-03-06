/* eslint-disable react/destructuring-assignment */
import React from 'react';

import { has } from 'ramda';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { firstQuestion, questionSet } = require('./questions.json');

interface QuizProps {
  sandbox?: Record<string, string>;
  setSandbox?: ((output: Record<string, string>) => void) | null;
  nextQuestion?: string;
}

function Quiz(props: QuizProps) {
  const output = props?.sandbox;
  const setOutput = props?.setSandbox;
  let question = props?.nextQuestion || firstQuestion;

  // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires
  const QuestionComponent = require(`./${questionSet[question].component}`).default;

  const renderNextQuestion = (out: Record<string, string> | undefined) => () => {
    const nextProps = questionSet[question];
    if (has('exact_answer', nextProps.question)) {
      const userAnswer = out?.[nextProps.inputName]?.toLowerCase();
      const filterAnswers = nextProps.question.exact_answer;
      if (userAnswer && has(userAnswer, filterAnswers)) {
        question = filterAnswers[userAnswer];
      }
    } else if (has('default', nextProps.question)) {
      question = nextProps.question.default;
    }
  };

  return (
    <>
      <QuestionComponent
        questionProps={questionSet[question]}
        renderNextQuestion={renderNextQuestion(output)}
        output={output}
        setOutput={setOutput}
      />
      <pre>
        INPUT:
        {JSON.stringify(questionSet[question], null, 2)}
      </pre>
      <pre style={{ textAlign: 'right', right: '0px' }}>
        OUTPUT:
        {JSON.stringify(output, null, 2)}
      </pre>
    </>
  );
}

Quiz.getInitialProps = () => questionSet[firstQuestion];

export default Quiz;
