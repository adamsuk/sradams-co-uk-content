import Index from "../components/Index";

const welcome_txt = `Hello World!

  So I'm new to JavaScript, Next.js and most things front-end.

  This is a little personal project of mine to get up to speed.

  Feel free to snoop around and by all means keep coming back, I'm learning daily!
  
  See you soon`;

const Homepage = () => <Index img={"https://github.com/adamsuk.png"} welcome_txt={welcome_txt}></Index>;

export default Homepage
