import React, { useState, useEffect } from 'react';
import Play from './icons/Play'
import Pause from './icons/Pause'
import Previous from './icons/Previous'
import Next from './icons/Next'
import Shuffle from './icons/Shuffle'

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

  var sectionStyle = {
    display: "grid",
    height: "100%",
    width: "100%",
    maxHeight: "500px",
    maxWidth: "500px",
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridAutoRows: '1fr',
    textAlign: 'center',
    itemAlign: 'center',
  }

  const imageStyle= {
    height: "100%",
    width: "100%",
    maxHeight: "400px",
    maxWidth: "400px",
    borderRadius: "15%",
    backgroundColor: "white",
    backgroundImage: `url(${props[counter].image})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  }

  const iconStyle = {
    height: '100%',
    width: '100%',
    maxHeight: '50px',
    maxWidth: '50px',
    fill: 'white',
    stroke: 'black',
    strokeWidth: "4"
  }

  return (
    <div style={{ ...sectionStyle, gridTemplateColumns: '1fr' }}>
      <h3 style={{ margin: '0' }}>{props[counter]?.show}</h3>
      <p style={{ marginTop: '0' }}>{props[counter]?.title}</p>
      <div onClick={randomise} style={{ position: 'relative' }}>
        {props[counter]?.image !== undefined &&
            <img src={props[counter].image} style={{height: "100%", width: "100%", maxHeight: "400px", maxWidth: "400px", borderRadius: "15%"}}/>
        }
        <div style={{ position: 'absolute', top: '0', bottom: '0', left: '0', right: '0', height: '100%', width: '100%' }}>
          {random &&
            <Shuffle style={{ ...iconStyle, maxHeight: '100%', maxWidth:'100%' }}/>
          }
        </div>
      </div>
      <div style={{ ...sectionStyle, paddingTop: '12px' }}>
        <div><Previous style={ iconStyle } onClick={previousSong} /></div>
        <div>{playing ? <Pause style={ iconStyle } onClick={toggle} /> : <Play style={ iconStyle } onClick={toggle} />}</div>
        <div><Next style={ iconStyle } onClick={nextSong} /></div>
      </div>
    </div>
  );
};

export default Player;