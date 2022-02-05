export default function Custom404() {
  return (
    <div className="flex flex-wrap flex-col mx-auto justify-center items-center h-screen max-w-7xl w-full">
      <div className="flex flex-col m-auto text-center content-center md:max-w-[35%]">
        <a className="text-[10rem]">😭</a>
        <br></br>
        <h1>Uh oh ...</h1>
        <br></br>
        <a>You've either clicked a TBC link or chanced it with a path that doesn't exist.</a>
        <a>Either way no page here.</a>
      </div>
    </div>
  )
}
