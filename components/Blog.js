import style from "../styles/Blog.module.scss";
import Link from 'next/link';

var Blog = ({ props }) => {

    // decending
    var publishDateSort = (a, b) => {
        b = b.published_date.split('-').join();
        a = a.published_date.split('-').join();
        return a > b ? -1 : a < b ? 1 : 0;
    };

    var printTagsFromMeta = (post_metadata) => {
        if (post_metadata.tags) {
            return post_metadata.tags.join(', ');
        } else {
            return 'N/A'
        }
    }

    var getUniqueTagsFromMeta = (posts_metadata) => {
        var all_unique_tags = []
        posts_metadata.map((post_metadata) => {
            var unique_post_tags = [...new Set(post_metadata.tags)]
            all_unique_tags = [...new Set([...unique_post_tags, ...all_unique_tags])]
        })
        return all_unique_tags
    }

    console.log(getUniqueTagsFromMeta(props.posts_metadata))

    return (
        <div className={style.List}> 
            <div>
                <h1>{props.blogTitle}</h1>
                <hr></hr>
            </div>
            {props.posts_metadata.sort(publishDateSort).map((post) => (
                <div>
                    <div>
                        <a key={`${post.slug}-a`} href={`/posts/${encodeURIComponent(post.slug)}`}>
                            <button type="button">
                                <h3>{post.title}</h3>
                                <h4>TAGS: </h4><p>{printTagsFromMeta(post)}</p><br></br>
                                <h4>Posted: </h4><p>{post.published_date}</p><br></br><br></br>
                                <h4>TL;DR:</h4><br></br><p>{post.tldr||"Either no TL or you should Definitely Read it"}</p>
                                <br></br><br></br>
                            </button>
                        </a>
                    </div>
                    <a>
                        <hr></hr>
                    </a>
                </div>
            ))}
        </div>
    )
}

export default Blog