import Calculator from './Calculator';
// import MusicPlayer from './MediaPlayer';
import Quiz from './quiz';

const sandboxes = [
  {
    title: 'Calculator',
    slug: 'calculator',
    component: Calculator,
  },
  // {
  //   title: "Podcast Player",
  //   slug: 'podcast-player',
  //   component: MusicPlayer
  // },
  {
    title: 'Dynamic Quiz',
    slug: 'quiz',
    component: Quiz,
  },
];

export default sandboxes;
