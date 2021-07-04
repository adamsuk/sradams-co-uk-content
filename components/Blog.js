import Layout from './Layout';
import style from "../styles/Blog.module.scss";
import Link from 'next/link';

var Blog = ({ props }) => {

    // decending
    var publishDateSort = (a, b) => {
        b = b.published_date.split('-').join();
        a = a.published_date.split('-').join();
        return a > b ? -1 : a < b ? 1 : 0;
    };

    var getTagsFromMeta = (post_metadata) => {
        if (post_metadata.tags) {
            return post_metadata.tags.join(', ');
        } else {
            return 'N/A'
        }
    }

    return (
        <Layout title="Blog">
        <div className={style.List}> 
            <h1>{props.blogTitle}</h1>
            <hr></hr>
            {props.posts_metadata.sort(publishDateSort).map((post) => (
                <div key={`${post.slug}-a`}>
                    <Link key={post.id}_btn href={`/posts/${encodeURIComponent(post.slug)}`}>
                        <button type="button" href={`/posts/${encodeURIComponent(post.slug)}`}>
                            <h3>{post.title}</h3>
                            <h4>TAGS: </h4><p>{getTagsFromMeta(post)}</p><br></br>
                            <h4>Posted: </h4><p>{post.published_date}</p><br></br><br></br>
                            <h4>TL;DR:</h4><br></br><p>{post.tldr||"No TL;DR ... you'll just have to read it ;)"}</p>
                            <br></br><br></br>
                        </button>
                    </Link>
                    <hr></hr>
                </div>
            ))}
        </div>
        </Layout>
    )
}

export default Blog