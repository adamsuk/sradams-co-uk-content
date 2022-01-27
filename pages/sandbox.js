import React, { useState, useEffect } from "react";
import axios from 'axios';

import Calculator from "../components/sandbox/Calculator";
import MusicPlayer from "../components/sandbox/MediaPlayer"

const Sandbox = (props) => {
  const Component = MusicPlayer;
  return (
    <div className="relative container px-7 pt-7 mb-auto flex flex-wrap flex-col md:flex-row md:px-0 w-full max-w-7xl mx-auto justify-between">
      {/* <Calculator/> */}
      <Component props={props}/>
    </div>
  );
};

Sandbox.getInitialProps = async () => {
  //const { data } = await axios.get('https://api.sradams.co.uk/random-podcast');
  const { data } = await axios.get('https://api.sradams.co.uk/all-podcasts');
  console.log(data)
  return (data);
}

export default Sandbox
