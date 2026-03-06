import React from 'react';

function Pause(props: React.SVGProps<SVGSVGElement>) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <svg fill="none" viewBox="0 0 120 120" stroke="white" {...props}>
      <polygon points="15,0 50,0 50,120 15,120" />
      <polygon points="70,0 105,0 105,120 70,120" />
    </svg>
  );
}

export default Pause;
