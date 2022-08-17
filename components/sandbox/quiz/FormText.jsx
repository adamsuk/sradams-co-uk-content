import React from 'react';
import PropTypes from 'prop-types';

function FormText({
  questionProps: { inputName, title }, renderNextQuestion, output, setOutput,
}) {
  const storeUserAnswer = (event) => {
    setOutput({
      ...output,
      [inputName]: event.target.value,
    });
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

FormText.defaultProps = {
  output: {},
  setOutput: null,
};

FormText.propTypes = {
  questionProps: PropTypes.shape({
    inputName: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  renderNextQuestion: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  output: PropTypes.object,
  setOutput: PropTypes.func,
};

export default FormText;
