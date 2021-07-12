
const FormText = ({ props, renderNextQuestion, output, setOutput }) => {

  const storeUserAnswer = (event) => {
    setOutput({
      ...output,
      [props.inputName]: event.target.value
    })
  }

  return (
    <div className='p-8 justify-center items-center h-screen flex'>
    <form>
      <label>
        {props.title}
      </label>
      <input type="text" name={props.inputName} onChange={storeUserAnswer} />
      <button type="button" onClick={renderNextQuestion}>Next</button>
    </form>
    </div>
  )
}

export default FormText