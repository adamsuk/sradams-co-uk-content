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
        <br></br><br></br>
        <Link href="/posts/sandbox">
          <a>My Sandbox is HERE!</a>
        </Link>{' '}
        <br></br><br></br>
        <Link href="/posts/music-music-music">
          <a>Music iFrames</a>
        </Link>{' '}
        <br></br><br></br>
        <Link href="/posts/its-been-a-while">
          <a>Its Been a While</a>
        </Link>{' '}
        <br></br><br></br>
        <Link href="/posts/cv">
          <a>WIP CV</a>
        </Link>{' '}
        <br></br><br></br>
        <Link href="/posts/gitlab-commit-2020">
          <a>Gitlab Commit 2020 Proposal</a>
        </Link>{' '}
        <br></br><br></br>
        <Link href="/posts/devops-and-me">
          <a>DevOps and Me</a>
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