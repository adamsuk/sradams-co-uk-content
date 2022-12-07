import Calculator from './Calculator';
// import MusicPlayer from './MediaPlayer';
import Quiz from './quiz';
import Pico8 from './Pico8';

const sandboxes = [
  // {
  //   title: "Podcast Player",
  //   slug: 'podcast-player',
  //   component: MusicPlayer
  // },
  {
    title: 'Pico8 Game',
    slug: 'pico8',
    component: Pico8,
  },
  {
    title: 'Dynamic Quiz',
    slug: 'quiz',
    component: Quiz,
  },
  {
    title: 'Calculator',
    slug: 'calculator',
    component: Calculator,
  },
];

export default sandboxes;
