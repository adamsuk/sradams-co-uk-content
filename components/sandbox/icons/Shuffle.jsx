import React from 'react';

function Shuffle(props) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <svg fill="none" viewBox="0 0 280 280" stroke="white" {...props}>
      <path
        transform="scale(-1, 1) translate(-280, 0)"
        d="M211,123.816c4.971,0,9-4.029,9-9s-4.029-9-9-9h-39.913c-2.886,0-5.597,1.384-7.29,3.722l-10.799,14.913l-9.973-13.772
          c-1.693-2.338-4.404-3.722-7.29-3.722H97.723V95.681c0-1.927-2.243-2.986-3.731-1.76l-24.161,19.896
          c-1.108,0.912-1.108,2.609,0,3.521l24.161,19.896c1.488,1.225,3.731,0.167,3.731-1.76v-10.516h33.418l10.746,14.839l-11.316,15.627
          H97.723v-10.896c0-1.927-2.243-2.986-3.731-1.761l-24.161,19.896c-1.108,0.912-1.108,2.609,0,3.521l24.161,19.896
          c1.488,1.225,3.731,0.167,3.731-1.761v-10.896h37.442c2.886,0,5.597-1.384,7.29-3.722l10.544-14.56l11.37,15.701
          c1.693,2.338,4.404,3.722,7.29,3.722H211c4.971,0,9-4.029,9-9s-4.029-9-9-9h-34.748l-12.142-16.767l11.572-15.98H211z"
      />
    </svg>
  );
}

export default Shuffle;
