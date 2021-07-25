import React from 'react'
import Layout from '../../components/Layout'
import Player from '../../components/sandbox/MediaPlayer.js';

import axios from 'axios';

const Music = (props) => {
  return (
    <Layout title="Music-Player">
      <Player props={props}></Player>
    </Layout>
  )
}

Music.getInitialProps = async () => {
  //const { data } = await axios.get('https://api.sradams.co.uk/random-podcast');
  const { data } = await axios.get('https://api.sradams.co.uk/all-podcasts');
  return (data);
}

export default Music
