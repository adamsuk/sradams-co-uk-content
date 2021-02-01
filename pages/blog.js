import React from 'react'
import Layout from '../components/Layout'
import style from "../components/blog.module.scss";
import Link from 'next/link'

function Blog(props) {
  return (
    <Layout title="Blog">
      <h1>{props.blogTitle}</h1>
      <br></br><br></br>
      <div class={style.item}> 
        <Link href="/posts/first-post">
          <a>First Post!</a>
        </Link>{' '}
      </div>
    </Layout>
  )
}

Blog.getInitialProps = () => {
  return {
    blogTitle: 'Welcome to my blog!'
  }
}

export default Blog