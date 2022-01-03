import Markdown from 'react-markdown'

export default function Custom404() {
  return (
    <div className="flex justify-center items-center h-screen max-w-7xl w-full p-7">
      <Markdown className="prose dark:prose-invert whitespace-no-wrap">
        :sob:
      </Markdown>
      <br></br>
      <div className="m-auto text-center content-center md:max-w-[50%]">
        <h1>Uh oh - Page Not Found</h1>
        <a>You've either clicked a TBC link or chanced it with a path that doesn't exist. Either way no page here.</a>
      </div>
    </div>
  )
}
