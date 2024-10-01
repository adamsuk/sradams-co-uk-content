/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';
import { useTheme } from 'next-themes';

function Loader() {
  const { theme } = useTheme();
  const [loaderProps, setLoaderProps] = useState({});

  useEffect(() => {
    if (theme) {
      const loaderColor = theme === 'dark' ? 'white' : 'black';
      setLoaderProps({ ...loaderProps, color: loaderColor });
    }
  }, [theme]);

  return (
    <div className="flex max-w-screen w-full h-full justify-center items-center">
      <PacmanLoader {...loaderProps} />
    </div>
  );
}

export default Loader;
