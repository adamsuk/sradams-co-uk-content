import matter from 'gray-matter'
import Post from "../../components/Post";
import style from "./../../styles/Blog.module.scss";

function PostTemplate({ content, data }) {
    return (
      <Post content={content} data={data} />
  )
}

PostTemplate.Layout = style.Blog;

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
