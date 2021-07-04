import React from 'react'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown/with-html';

import Header from '../../components/Header'
import NavBar from '../../components/NavBar'
import style from "../../components/blog.module.scss";

function PostTemplate({ content, data }) {
    // This holds the data between `---` from the .md file
    const frontmatter = data
    
    return (
      <div className={style.Blog}>
        <Header />
        <div className={style.Post}>
          <h1><center>{frontmatter.title}</center></h1>
          <hr></hr>
          <ReactMarkdown source={content}/>
        </div>
        <NavBar />
      </div>
  )
}

PostTemplate.getInitialProps = async (context) => {
  const { slug } = context.query

  // Import our .md file using the `slug` from the URL
  const content = await import(`../../blog-content/${slug}.md`)

  // Parse .md data through `matter`
  const data = matter(content.default)


  // Pass data to our component props
  return { ...data }
}

export default PostTemplate
