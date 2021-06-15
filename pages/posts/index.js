import React from 'react'
import Router from 'next/router'
import Layout from '../../components/Layout'
import style from "../../components/blog.module.scss";
import matter from 'gray-matter'
import Link from 'next/link'

function Index(props) {
    return (
        <Layout title="Blog">
        <h1>{props.blogTitle}</h1>
        <br></br><br></br>
        <div class={style.item}> 
            {props.posts_metadata.map((post) => (
                <a key={post.id}>
                <Link href={`/posts/${encodeURIComponent(post.slug)}`}>
                    <a>{post.title}</a>
                </Link>
                <br></br>
                <br></br>
                </a>
            ))}
        </div>
        </Layout>
    )
}

Index.getInitialProps = async () => {
    // find all files in the post directory
    const path = require('path');
    // TODO: breaks on backs
    var fs = require('fs');
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
                'last_edited': stats.mtime,
            });
        };
    };
    // decending
    posts_metadata.sort(function(a,b){
        return b.last_edited - a.last_edited;
    });

    return {
      blogTitle: 'Welcome to my blog!',
      posts_metadata: posts_metadata,
    }
}

export default Index