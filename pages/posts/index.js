import Layout from '../../components/Layout';
import style from "../../components/blog.module.scss";
import matter from 'gray-matter';
import Link from 'next/link';
import path from 'path';
import fs from 'fs';

var Index = (props) => {
    // decending
    var publishDateSort = (a, b) => {
        b = b.published_date.split('-').join();
        a = a.published_date.split('-').join();
        return a > b ? -1 : a < b ? 1 : 0;
    };

    return (
        <Layout title="Blog">
        <h1>{props.blogTitle}</h1>
        <br></br><br></br>
        <div className={style.item}> 
            {props.posts_metadata.sort(publishDateSort).map((post) => (
                <div key={`${post.slug}-a`}>
                <Link key={post.id} href={`/posts/${encodeURIComponent(post.slug)}`}>
                    {post.title}
                </Link>
                <br></br>
                <br></br>
                </div>
            ))}
        </div>
        </Layout>
    )
}

export async function getStaticProps() {
    // find all files in the post directory
    // find all files in post location
    // TODO: make this more defensive and check path first
    var files = fs.readdirSync("./blog-content");

    let posts_metadata = new Array();

    // loop over all files found in that directory
    for (var file of files) {
        if (path.parse(file).ext == '.md') {
            // Import our .md file using the `slug` from the URL
            var content = await import(`./../../blog-content/${file}`);
            var stats = fs.statSync(`./blog-content/${file}`);
            // Parse .md data through `matter`
            const { data } = matter(content.default)
            
            posts_metadata.push({
                'title': data.title,
                'slug': path.parse(file).name,
                //'last_edited': stats.mtime,
                'published_date': data.date,
            });
        };
    };

    return {
        'props': {
            blogTitle: 'Welcome to my blog!',
            posts_metadata: await Promise.all(posts_metadata),
            }
        };
}

export default Index