import React from 'react';

function Previous(props: React.SVGProps<SVGSVGElement>) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <svg fill="currentColor" viewBox="0 0 120 120" stroke="none" {...props}>
      <polygon points="20,20 40,20 40,100 20,100" />
      <polygon points="90,100 90,20 40,60" />
    </svg>
  );
}

export default Previous;
