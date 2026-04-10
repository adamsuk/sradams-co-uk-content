/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";

import Play from "./icons/Play";
import Pause from "./icons/Pause";
import Previous from "./icons/Previous";
import Next from "./icons/Next";
import Shuffle from "./icons/Shuffle";

interface Podcast {
  url: string;
  show?: string;
  title?: string;
  image?: string;
}

interface UseAudioArgs {
  podcasts: Podcast[];
}

const useAudio = ({ podcasts }: UseAudioArgs) => {
  const [audio, setState] = useState<HTMLAudioElement | undefined>();
  const [playing, setPlaying] = useState(false);
  const [random, setRandom] = useState(false);
  const [next, setNext] = useState(false);
  const [counter, setCounter] = useState(0);

  const toggle = () => setPlaying(!playing);
  const randomise = () => setRandom(!random);
  const nextSong = () => {
    setCounter((prev) => {
      if (random && podcasts.length > 0) {
        return Math.floor(Math.random() * podcasts.length);
      }
      return prev >= podcasts.length - 1 ? podcasts.length - 1 : prev + 1;
    });
  };
  const previousSong = () => {
    setCounter((prev) => {
      if (random && podcasts.length > 0) {
        return Math.floor(Math.random() * podcasts.length);
      }
      return prev <= 0 ? 0 : prev - 1;
    });
  };

  useEffect(() => {
    if (audio && podcasts.length > 0 && podcasts[counter]?.url) {
      audio.src = podcasts[counter].url;
      audio.load();
      if (playing) {
        audio.play();
      }
    } else if (!audio && podcasts.length > 0 && podcasts[counter]?.url) {
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
      setNext(false);
    }
  }, [next]);

  useEffect(() => {
    if (!audio) return undefined;
    const handleEnded = () => setNext(true);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
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
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  const sectionStyle: React.CSSProperties = {
    display: "grid",
    height: "100%",
    width: "100%",
    maxHeight: "500px",
    maxWidth: "500px",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridAutoRows: "1fr",
    textAlign: "center",
  };

  const iconStyle: React.CSSProperties = {
    height: "100%",
    width: "100%",
    maxHeight: "50px",
    maxWidth: "50px",
    fill: "white",
    stroke: "black",
    strokeWidth: "4",
  };

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    axios
      .get("https://podcasts.sradams.co.uk/all-podcasts")
      .then((res) => {
        if (isMounted.current && res.data) {
          setPodcasts(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      isMounted.current = false;
    };
  }, []);

  const audioControls = useAudio({ podcasts });

  if (podcasts.length === 0) {
    return (
      <div style={{ ...sectionStyle, gridTemplateColumns: "1fr" }}>
        <p>Loading podcasts...</p>
      </div>
    );
  }

  const {
    playing,
    toggle,
    random,
    randomise,
    previousSong,
    nextSong,
    counter,
  } = audioControls;

  return (
    <div style={{ ...sectionStyle, gridTemplateColumns: "1fr" }}>
      <h3 style={{ margin: "0" }}>{podcasts[counter]?.show}</h3>
      <p style={{ marginTop: "0" }}>{podcasts[counter]?.title}</p>
      <div onClick={randomise} style={{ position: "relative" }}>
        {podcasts[counter]?.image !== undefined && (
          <img
            alt=""
            src={podcasts[counter].image}
            className="h-full w-full max-h-[400px] max-w-[400px] rounded-[15%]"
          />
        )}
        <div
          style={{
            position: "absolute",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            height: "100%",
            width: "100%",
          }}
        >
          {random && (
            <Shuffle
              style={{ ...iconStyle, maxHeight: "100%", maxWidth: "100%" }}
            />
          )}
        </div>
      </div>
      <div style={{ ...sectionStyle, paddingTop: "12px" }}>
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
