import React from 'react';

function Next(props) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg fill="none" viewBox="0 0 120 120" stroke="white" {...props}>
      <polygon points="80,20 100,20 100,100 80,100" />
      <polygon points="30,100 30,20 80,60" />
    </svg>
  );
}

export default Next;
