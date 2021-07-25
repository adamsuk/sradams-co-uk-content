import React, { useState, useEffect } from 'react'

const useAudio = url => {
  const [audio, setState] = useState();
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    setState(new Audio(url))
  }, [])

  useEffect(() => {
      console.log(`playing: ${playing}`)
      console.log(`audio: ${audio}`)
      if (audio) {
        playing ? audio.play() : audio.pause();
      }
    },
    [playing, audio]
  );

  useEffect(() => {
    if (audio) {
      audio.addEventListener('ended', () => setPlaying(false));
      return () => {
        audio.removeEventListener('ended', () => setPlaying(false));
      };
    } else {
      return {}
    }
  }, [audio]);

  return [playing, toggle];
};

const Player = ({ props }) => {
  const [playing, toggle] = useAudio(props.url);

  return (
    <>
    <div>
      <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
    </div>
    <pre>PODCAST:{JSON.stringify({...props}, null, '\t')}</pre>
    </>
  );
};

export default Player;