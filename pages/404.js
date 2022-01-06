export default function Custom404() {
  return (
    <div className="flex flex-wrap flex-col mx-auto justify-center items-center h-screen max-w-7xl w-full p-7">
      <div className="flex-1 flex-col m-auto text-center content-center md:max-w-[50%]">
        <a className="text-[10rem]">😭</a>
        <br></br>
        <h1>Uh oh - Page Not Found</h1>
        <a>You've either clicked a TBC link or chanced it with a path that doesn't exist. Either way no page here.</a>
      </div>
    </div>
  )
}
