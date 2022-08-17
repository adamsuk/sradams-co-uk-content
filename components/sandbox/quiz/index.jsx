/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import { has } from 'ramda';

const { firstQuestion, questionSet } = require('./questions.json');

function Quiz(props) {
  const output = props?.sandbox;
  const setOutput = props?.setSandbox;
  let question = props?.nextQuestion || firstQuestion;

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const QuestionComponent = require(`./${
    questionSet[question].component}`).default;

  const renderNextQuestion = (out) => () => {
    const nextProps = questionSet[question];
    // define some logic here to get the next question
    if (has('exact_answer', nextProps.question)) {
      const userAnswer = out[nextProps.inputName].toLowerCase();
      const filterAnswers = nextProps.question.exact_answer;
      if (has(userAnswer, filterAnswers)) {
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

Quiz.defaultProps = {
  sandbox: {},
  setSandbox: null,
  nextQuestion: '',
};

Quiz.propTypes = {
  sandbox: PropTypes.object,
  setSandbox: PropTypes.func,
  nextQuestion: PropTypes.string,
};

export default Quiz;
