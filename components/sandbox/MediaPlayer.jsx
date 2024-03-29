/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Play from './icons/Play';
import Pause from './icons/Pause';
import Previous from './icons/Previous';
import Next from './icons/Next';
import Shuffle from './icons/Shuffle';

const useAudio = ({ podcasts }) => {
  const [audio, setState] = useState();
  const [playing, setPlaying] = useState(false);
  const [random, setRandom] = useState(false);
  const [next, setNext] = useState(false);
  const [counter, setCounter] = useState(0);

  const toggle = () => setPlaying(!playing);
  const randomise = () => setRandom(!random);
  const nextSong = () => {
    if (random) {
      setCounter(Math.floor(Math.random() * Object.keys(podcasts).length));
    } else {
      setCounter(
        counter >= Object.keys(podcasts).length - 1
          ? Object.keys(podcasts).length - 1
          : counter + 1,
      );
    }
  };
  const previousSong = () => {
    if (random) {
      setCounter(Math.floor(Math.random() * Object.keys(podcasts).length));
    } else {
      setCounter(counter <= 0 ? 0 : counter - 1);
    }
  };

  useEffect(() => {
    if (audio) {
      audio.src = podcasts[counter].url;
      audio.load();
      if (playing) {
        audio.play();
      }
    } else if (podcasts.length > 0) {
      setState(new Audio(podcasts[counter].url));
    }
  }, [counter, podcasts]);

  useEffect(() => {
    if (audio) {
      if (playing) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [playing, audio]);

  useEffect(() => {
    if (next) {
      nextSong();
    }
  }, [next]);

  useEffect(() => {
    if (audio) {
      audio.addEventListener('ended', () => setNext(true));
      return () => {
        audio.removeEventListener('ended', () => setNext(false));
      };
    }
    return {};
  }, [audio]);

  return {
    playing,
    random,
    toggle,
    randomise,
    previousSong,
    nextSong,
    counter,
  };
};

function Player() {
  const [podcasts, setPodcasts] = useState([]);

  const sectionStyle = {
    display: 'grid',
    height: '100%',
    width: '100%',
    maxHeight: '500px',
    maxWidth: '500px',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridAutoRows: '1fr',
    textAlign: 'center',
    itemAlign: 'center',
  };

  // const imageStyle= {
  //   height: "100%",
  //   width: "100%",
  //   maxHeight: "400px",
  //   maxWidth: "400px",
  //   borderRadius: "15%",
  //   backgroundColor: "white",
  //   backgroundImage: podcasts ? `url(${podcasts[counter].image})` : "",
  //   backgroundPosition: 'center',
  //   backgroundRepeat: 'no-repeat',
  //   backgroundSize: 'cover'
  // }

  const iconStyle = {
    height: '100%',
    width: '100%',
    maxHeight: '50px',
    maxWidth: '50px',
    fill: 'white',
    stroke: 'black',
    strokeWidth: '4',
  };

  useEffect(() => {
    axios
      .get('http://localhost:3001/all-podcasts')
      .then((res) => {
        setPodcasts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const {
    playing,
    toggle,
    random,
    randomise,
    previousSong,
    nextSong,
    counter,
  } = useAudio({ podcasts });

  if (!Object.keys(podcasts).length) return null;

  return (
    <div style={{ ...sectionStyle, gridTemplateColumns: '1fr' }}>
      <h3 style={{ margin: '0' }}>{podcasts[counter]?.show}</h3>
      <p style={{ marginTop: '0' }}>{podcasts[counter]?.title}</p>
      <div onClick={randomise} style={{ position: 'relative' }}>
        {podcasts[counter]?.image !== undefined && (
          <img
            alt=""
            src={podcasts[counter].image}
            className="h-full w-full max-h-[400px] max-w-[400px] rounded-[15%]"
          />
        )}
        <div
          style={{
            position: 'absolute',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            height: '100%',
            width: '100%',
          }}
        >
          {random && (
            <Shuffle
              style={{ ...iconStyle, maxHeight: '100%', maxWidth: '100%' }}
            />
          )}
        </div>
      </div>
      <div style={{ ...sectionStyle, paddingTop: '12px' }}>
        <div>
          <Previous style={iconStyle} onClick={previousSong} />
        </div>
        <div>
          {playing ? (
            <Pause style={iconStyle} onClick={toggle} />
          ) : (
            <Play style={iconStyle} onClick={toggle} />
          )}
        </div>
        <div>
          <Next style={iconStyle} onClick={nextSong} />
        </div>
      </div>
    </div>
  );
}

export default Player;
