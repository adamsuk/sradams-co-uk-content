import Blog from '../components/Blog';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

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
                slug: path.parse(file).name,
                published_date: data.date,
                ...data
            });
        };
    };

    // github adamsuk readme post
    const github_readme = await fetch('https://raw.githubusercontent.com/adamsuk/adamsuk/main/README.md')
        .then((res) => {
            const date = new Date(res.headers.get('date'));
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = date.getFullYear();
            posts_metadata.push({
                title: 'Hi There ... from Github',
                slug: 'hi-there',
                published_date: yyyy + '-' + mm + '-' + dd,
                tags: ['Github'],
                tldr: 'You may have seen this before, my Github profile welcome README :)'
            })
        })

    return {
        'props': {
            blogTitle: 'Welcome to my blog!',
            posts_metadata: await Promise.all(posts_metadata),
            }
        };
}

export default Index