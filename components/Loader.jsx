import React from 'react';
import { PacmanLoader } from 'react-spinners';

function Loader() {
  return (
    <div className="flex max-w-screen w-full h-full justify-center items-center">
      <PacmanLoader />
    </div>
  );
}

export default Loader;
