import React from 'react'
import ReactMarkdown from 'react-markdown/with-html';

import style from "../styles/Blog.module.scss";

function Post({ content, data }) {
    // This holds the data between `---` from the .md file
    const frontmatter = data
    
    return (
      <div className={style.Blog}>
        <div className={style.Post}>
          <h1><center>{frontmatter.title}</center></h1>
          <hr></hr>
          <ReactMarkdown source={content}/>
        </div>
      </div>
  )
}

export default Post;