import React from 'react'
import Image from 'next/image'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown/with-html';

import Header from '../../components/Header'

function PostTemplate({ content, data }) {
    // This holds the data between `---` from the .md file
    const frontmatter = data
    
    return (
      <>
        <Header />
        <h1><center>{frontmatter.title}</center></h1>
        <ReactMarkdown source={content} />
      </>
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
