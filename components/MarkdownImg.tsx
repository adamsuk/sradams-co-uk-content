import React from 'react';

interface MarkdownImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
}

// Normalise image URLs that arrive with HTML-entity or percent-encoded artefacts
// from the markdown / rehype pipeline:
//  - Replace literal "&amp;" with "&" so query-string separators work correctly.
//  - Strip a trailing "%22" (URL-encoded double-quote) left by a stray '"' in
//    the markdown image URL before the closing ')'.
function MarkdownImg({ src, alt, ...props }: MarkdownImgProps) {
  const cleanSrc = src?.replace(/&amp;/g, '&').replace(/%22$/i, '');
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <img src={cleanSrc} alt={alt ?? ''} {...props} />;
}

export default MarkdownImg;
