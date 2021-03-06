import React, {useEffect} from "react";
import Layout from './Layout'
import style from "../styles/Homepage.module.scss";

const Homepage = pageProps => {

  useEffect(() => {
    const delay_render = setTimeout(() => {
      var elem = document.getElementById('welcome-txt');
      elem.innerText = pageProps.welcome_txt;
    }, 1000);
  }, [])

  return (<Layout>
  <div className={style.item}>
    <a>
    <img
        src={pageProps.img}
    />
    <p id='welcome-txt'></p>
    </a>
  </div>
  </Layout>
  );
};


export default Homepage
