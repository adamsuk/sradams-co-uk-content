import React from 'react';

function Play(props) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg fill="none" viewBox="0 0 120 120" stroke="white" {...props}>
      <polygon points="25,120 25,0 107.5,60" />
    </svg>
  );
}

export default Play;
