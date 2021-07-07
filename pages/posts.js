import Blog from '../components/Blog';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import style from "../styles/Blog.module.scss";


var Index = props => {
    return (
        <Blog title="Blog" props={props}></Blog>
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
            var content = await import(`./../blog-content/${file}`);
            var stats = fs.statSync(`./blog-content/${file}`);
            // Parse .md data through `matter`
            const { data } = matter(content.default)
            
            posts_metadata.push({
                'title': data.title,
                'slug': path.parse(file).name,
                'published_date': data.date,
                ... data
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