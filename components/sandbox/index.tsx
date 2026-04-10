import React from 'react';
import Calculator from './Calculator';
import MusicPlayer from './MediaPlayer';
import Quiz from './quiz';
import Pico8 from './Pico8';

interface SandboxItem {
  title: string;
  slug: string;
  component: React.ComponentType<Record<string, unknown>>;
}

const sandboxes: SandboxItem[] = [
  {
    title: 'Pico8 Game',
    slug: 'pico8',
    component: Pico8 as React.ComponentType<Record<string, unknown>>,
  },
  {
    title: 'Dynamic Quiz',
    slug: 'quiz',
    component: Quiz as React.ComponentType<Record<string, unknown>>,
  },
  {
    title: 'Calculator',
    slug: 'calculator',
    component: Calculator as React.ComponentType<Record<string, unknown>>,
  },
  {
    title: 'Podcast Player',
    slug: 'podcast-player',
    component: MusicPlayer,
  },
];

export default sandboxes;
