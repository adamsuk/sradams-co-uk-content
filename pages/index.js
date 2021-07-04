import Homepage from "../components/Homepage";

const welcome_txt = `Hello World!

  I'm Scott a Developer and Platform Engineer.

  This is a little safe space of mine to practice all things front-end.

  Feel free to snoop around and by all means keep coming back, I'm learning daily!
  
  See you soon`;

const homepage = () => <Homepage img={"https://github.com/adamsuk.png"} welcome_txt={welcome_txt}></Homepage>;

export default homepage
