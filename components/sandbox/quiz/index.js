import React from 'react'
import { has } from 'ramda'

const Quiz = props => {
  const { first_question, question_set } = require("./questions.json")
  var output = props?.sandbox;
  var setOutput = props?.setSandbox;
  var next_question = props?.next_question || first_question;
  const QuestionComponent = require("./" + question_set[next_question].component).default
  
  const renderNextQuestion = (output) => (event) => {
    props = question_set[next_question]
    // define some logic here to get the next question
    if (has("exact_answer", props.nextQuestion)) {
      const user_answer = output[props.inputName].toLowerCase()
      const filter_answers = props.nextQuestion.exact_answer
      if (has(user_answer, filter_answers)) {
        next_question = filter_answers[user_answer]
      }
    } else if (has("default", props.nextQuestion)) {
      next_question = props.nextQuestion.default
    }
  }

  return (
    <>
      <QuestionComponent
        props={question_set[next_question]}
        renderNextQuestion={renderNextQuestion(output)}
        output={output}
        setOutput={setOutput} >
      </QuestionComponent>
      <pre>INPUT:{JSON.stringify(question_set[next_question], null, 2)}</pre>
      <pre style={{textAlign: "right", right: "0px"}}>OUTPUT:{JSON.stringify(output, null, 2)}</pre>
    </>
  )
}

Quiz.getInitialProps = () => {
  return question_set[first_question];
};

// Quiz.Layout = style.Container;

export default Quiz