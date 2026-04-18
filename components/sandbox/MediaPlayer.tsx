/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

"use client";

import React, { useState, useEffect, useRef } from "react";
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

const Player = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    axios
      // TODO: lets have something a little less grim than everything
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
      <div className="flex items-center justify-center h-64 w-full max-w-md mx-auto">
        <p className="text-gray-500">Loading podcasts...</p>
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
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="relative mb-4">
        {podcasts[counter]?.image && (
          <img
            alt={podcasts[counter]?.title || "Podcast cover"}
            src={podcasts[counter]?.image}
            className="w-48 h-48 rounded-lg object-cover shadow-md"
          />
        )}
        {random && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <Shuffle className="w-12 h-12 text-white" />
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {podcasts[counter]?.show}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {podcasts[counter]?.title}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6">
        <button
          type="button"
          onClick={previousSong}
          className="p-2 rounded-full hover:bg-gray-500 bg-gray-700 transition-colors"
          aria-label="Previous track"
        >
          <Previous className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          type="button"
          onClick={toggle}
          className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-md"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>

        <button
          type="button"
          onClick={nextSong}
          className="p-2 rounded-full hover:bg-gray-500 bg-gray-700 transition-colors"
          aria-label="Next track"
        >
          <Next className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Shuffle Toggle */}
      <button
        type="button"
        onClick={randomise}
        className={`mt-4 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          random
            ? "bg-blue-500 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        }`}
        aria-label="Toggle shuffle"
      >
        Shuffle
      </button>
    </div>
  );
};

export default Player;
