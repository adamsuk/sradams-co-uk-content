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
  // check to see if slug is special hi-there path
  let props;
  if (slug === 'hi-there') {
    // github adamsuk readme post
    props = await fetch('https://raw.githubusercontent.com/adamsuk/adamsuk/main/README.md')
      .then((res) => res.text())
      .then((text) => {
        return matter(text);
      })
    props.data = {
      title: 'Hi There ... from Github',
    }
  } else {
    // Import our .md file using the `slug` from the URL
    const content = await import(`../../blog-content/${slug}.md`)
    // Parse .md data through `matter`
    props = matter(content.default)
  }
  return { ...props }
}

export default PostTemplate
