import cn from 'classnames';

export default function Custom404(props) {
  return (
    <div className={cn(props.className, "relative top-1/2 translate-y-[-50%]")}>
      <div className="justify-center items-center w-full p-3 md:p-7">
        <div className="flex flex-col m-auto text-center content-center md:max-w-[35%]">
          <a className="text-[10rem]">😭</a>
          <br></br>
          <h1>Uh oh ...</h1>
          <br></br>
          <a>You've either clicked a TBC link or chanced it with a path that doesn't exist.</a>
          <a>Either way no page here.</a>
        </div>
      </div>
    </div>
  )
}
