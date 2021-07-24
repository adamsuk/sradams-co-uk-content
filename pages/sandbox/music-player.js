import React from 'react'
import Layout from '../../components/Layout'
import Player from '../../components/sandbox/MediaPlayer.js';

import axios from 'axios';

const Music = (props) => {
  console.dir(props)
  return (
    <>
      <Layout title="Music-Player">
        <Player url={props.url}></Player>
      </Layout>
      <pre>PODCAST:{JSON.stringify(props, null, 2)}</pre>
    </>
  )
}

Music.getInitialProps = async () => {
  const { data } = await axios.get('https://api.sradams.co.uk/random-podcast');
  //const res = Promise.resolve(raw_res);
  return (data);
}

export default Music
