const FormText = ({ props, renderNextQuestion, output, setOutput }) => {

  const storeUserAnswer = (event) => {
    setOutput({
      ...output,
      [props.inputName]: event.target.value
    })
  }

  return (
    <div>
      <br></br>
      <form>
        <div>
          {props.title}
        </div>
        <input type="text" name={props.inputName} onChange={storeUserAnswer} />
      </form>
      <br></br>
      <button type="button" onClick={renderNextQuestion}>Next</button>
      <br></br>
    </div>
  )
}

export default FormText