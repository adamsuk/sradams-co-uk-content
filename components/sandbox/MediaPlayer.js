import React, { useState, useEffect } from 'react'

const useAudio = props => {
  const [audio, setState] = useState();
  const [playing, setPlaying] = useState(false);
  const [next, setNext] = useState(false);
  const [counter, setCounter] = useState(0);
  const [song, setSong] = useState(props[counter]);

  const toggle = () => setPlaying(!playing);
  const nextSong = () => setCounter((counter >= props.length -1) ? props.length - 1 : counter + 1);
  const previousSong = () => setCounter((counter <= 0) ? 0 : counter - 1);

  useEffect(() => {
    console.log(song)
    setSong(props[counter]);
  }, [counter])

  useEffect(() => {
    if (audio) {
      audio.src = song.url
      audio.load()
      if (playing) {audio.play()}
    } else {
      setState(new Audio(song.url))
    }
    console.dir(audio)
  }, [song])

  useEffect(() => {
      if (audio) {
        playing ? audio.play() : audio.pause();
      }
    },
    [playing, audio]
  );

  useEffect(() => {
    nextSong();
  }, [next])

  useEffect(() => {
    if (audio) {
      audio.addEventListener('ended', () => setNext(true));
      return () => {
        audio.removeEventListener('ended', () => setNext(false));
      };
    } else {
      return {}
    }
  }, [audio]);

  return {
    playing,
    toggle,
    previousSong,
    nextSong,
    counter
  };
};

const Player = ({ props }) => {
  const { playing, toggle, previousSong, nextSong, counter } = useAudio(props);

  return (
    <div style={{height: "80%", width: "80%", position: "relative", justifyContent: "center", alignItems: "center", verticalAlign: "middle"}}>
      <div>
        <img
          src={props[counter].image}
          style={{height: "100%", width: "100%", borderRadius: "50%"}}/>
      </div>
      <div style={{position: "relative", display: "flex", justifyContent: "center", alignItems: "center", verticalAlign: "middle"}}>
        <button onClick={previousSong}>Previous</button>
        <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
        <button onClick={nextSong}>Next</button>
      </div>
    </div>
  );
};

export default Player;