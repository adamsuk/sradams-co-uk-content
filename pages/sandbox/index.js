import Sandbox from '../../components/Sandbox';
import fs from 'fs';

var Index = props => {
    return (
        <Sandbox title="Sandbox" props={props}></Sandbox>
    )
}

export async function getStaticProps() {
    // find all folders and files in the sandbox directory
    var files = fs.readdirSync("./pages/sandbox");

    var pages = [];

    // loop over all files found in that directory
    for (var file of files) {
        if (file.endsWith('.js')) {
            if (file !== 'index.js') {
                pages.push(file.split('.').slice(0, -1).join('.'));
            }
        } else {
            pages.push(file);
        }
    };

    return {
        'props': {
            title: 'Welcome to my sandbox!',
            pages: await Promise.all(pages),
        }
    };
}

export default Index