import React, { useState, useEffect } from 'react'

const useAudio = props => {
  const [audio, setState] = useState();
  const [playing, setPlaying] = useState(false);
  const [random, setRandom] = useState(false);
  const [next, setNext] = useState(false);
  const [counter, setCounter] = useState(0);
  const [song, setSong] = useState(props[counter]);

  const toggle = () => setPlaying(!playing);
  const randomise = () => setRandom(!random);
  const nextSong = () => {
    if (random) {
      setCounter(Math.floor(Math.random() * Object.keys(props).length));
    } else {
      setCounter((counter >= Object.keys(props).length -1) ? Object.keys(props).length - 1 : counter + 1);
    }
  };
  const previousSong = () => {
    if (random) {
      setCounter(Math.floor(Math.random() * Object.keys(props).length));
    } else {
      setCounter((counter <= 0) ? 0 : counter - 1);
    }
  };

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
    random,
    toggle,
    randomise,
    previousSong,
    nextSong,
    counter
  };
};

const Player = ({ props }) => {
  const { playing, toggle, random, randomise, previousSong, nextSong, counter } = useAudio(props);

  return (
    <>
    <div style={{height: "80%", width: "80%", justifyContent: "center", alignItems: "center", verticalAlign: "middle"}}>
      {props[counter]?.image !== undefined &&
      <>
        <div>
          <img src={props[counter].image} style={{height: "50%", width: "50%", borderRadius: "50%", justifyContent: "center", alignItems: "center"}}/>
        </div>
        <br></br>
      </>
      }
      <div style={{justifyContent: "center", alignItems: "center", verticalAlign: "middle"}}>
        <button onClick={previousSong}>Previous</button>
        <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
        <button onClick={nextSong}>Next</button>
      </div>
      <button onClick={randomise}>{random ? "Standardise" : "Randomise"}</button>
    </div>
    <pre>PODCAST:{JSON.stringify({...props[counter]}, null, '\t')}</pre>
    </>
  );
};

export default Player;