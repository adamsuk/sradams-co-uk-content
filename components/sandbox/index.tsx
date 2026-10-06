import React from 'react';
import FactorySim from 'factory-sim-viz';
import MegaChess from 'megachess-viz';
import Calculator from './Calculator';
import MusicPlayer from './MediaPlayer';
import Quiz from './quiz';
import Pico8 from './Pico8';

interface SandboxItem {
  title: string;
  slug: string;
  group: string;
  component: React.ComponentType<Record<string, unknown>>;
}

const sandboxes: SandboxItem[] = [
  {
    title: 'Podcast Player',
    slug: 'podcast-player',
    group: 'Media',
    component: MusicPlayer,
  },
  {
    title: 'megaChess',
    slug: 'megachess',
    group: 'Games',
    component: MegaChess as React.ComponentType<Record<string, unknown>>,
  },
  {
    title: 'Factory Sim',
    slug: 'factory-sim',
    group: 'Simulations',
    component: FactorySim as React.ComponentType<Record<string, unknown>>,
  },
  {
    title: 'Pico8 Game',
    slug: 'pico8',
    group: 'Games',
    component: Pico8 as React.ComponentType<Record<string, unknown>>,
  },
  {
    title: 'Dynamic Quiz',
    slug: 'quiz',
    group: 'Tools',
    component: Quiz as React.ComponentType<Record<string, unknown>>,
  },
  {
    title: 'Calculator',
    slug: 'calculator',
    group: 'Tools',
    component: Calculator as React.ComponentType<Record<string, unknown>>,
  },
];

export default sandboxes;
