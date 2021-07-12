import React from 'react'
import * as R from 'ramda'

const { first_question, question_set } = require("./questions.json")

const Quiz = props => {
  var [output, setOutput] = React.useState({});
  var [next_question, setNextQuestion] = React.useState(first_question);
  const QuestionComponent = require("./" + props.component).default
  
  const renderNextQuestion = (event) => {
    props = question_set[next_question]
    // define some logic here to get the next question
    if (R.has("exact_answer", props.nextQuestion)) {
      const user_answer = output[props.inputName].toLowerCase()
      const filter_answers = props.nextQuestion.exact_answer
      if (R.has(user_answer, filter_answers)) {
        setNextQuestion(filter_answers[user_answer])
      }
    } else if (R.has("default", props.nextQuestion)) {
      setNextQuestion(props.nextQuestion.default)
    }
  }

  return (
    <>
      <QuestionComponent
        props={question_set[next_question]}
        renderNextQuestion={renderNextQuestion}
        output={output}
        setOutput={setOutput} >
      </QuestionComponent>
      <pre>{JSON.stringify(output, null, 2)}</pre>
    </>
  )
}

Quiz.getInitialProps = () => {
  return question_set[first_question];
};

export default Quiz