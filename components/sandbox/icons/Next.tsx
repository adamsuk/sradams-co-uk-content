import React from 'react';

function Next(props: React.SVGProps<SVGSVGElement>) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <svg fill="currentColor" viewBox="0 0 120 120" stroke="none" {...props}>
      <polygon points="80,20 100,20 100,100 80,100" />
      <polygon points="30,100 30,20 80,60" />
    </svg>
  );
}

export default Next;
