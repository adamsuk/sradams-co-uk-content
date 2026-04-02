import env from '../../default-env';
import { BlogPost } from './models';

export const parsePost = (post: BlogPost): BlogPost => {
  let processedContent = post.content;

  const phpStreams: Record<string, string> = {
    'page://': `${env.NEXT_PUBLIC_CMS_URL}/user/pages/`,
  };

  Object.entries(phpStreams).forEach(([stream, url]) => {
    const regex = new RegExp(stream, 'g');
    processedContent = processedContent.replace(regex, url);
  });

  if (processedContent.startsWith('---')) {
    const endIndex = processedContent.indexOf('---', 3);
    if (endIndex !== -1) {
      processedContent = processedContent.slice(endIndex + 3).trim();
    }
  }

  return {
    ...post,
    content: processedContent,
  };
};

export default parsePost;
