import Image from 'next/image'

import Layout from '../components/Layout'
import style from "../components/index.module.scss";


const Index = () => <Layout>
  <div className={style.item}>
    <a>
    <img
        src="https://github.com/adamsuk.png"
        alt="Picture of ME!"
    />
    <p>
      Hello World!
      <br></br>
      <br></br>
      So I'm new to JavaScript, Next.js and most things front-end.
      <br></br>
      This is a little personal project of mine to get up to speed.
      <br></br>
      <br></br>
      Feel free to snoop around and by all means keep coming back, I'm learning daily!
      <br></br>
      <br></br>
      See you soon
    </p>
    </a>
  </div>
  </Layout>;

export default Index
