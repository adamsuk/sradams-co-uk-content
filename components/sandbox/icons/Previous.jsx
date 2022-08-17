import React from 'react';

function Previous(props) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg fill="none" viewBox="0 0 120 120" stroke="white" {...props}>
      <polygon points="20,20 40,20 40,100 20,100" />
      <polygon points="90,100 90,20 40,60" />
    </svg>
  );
}

export default Previous;
