import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import Layout from '../components/Layout'
import style from "../components/index.module.scss";


const Index = () => <Layout>
    <Image
        src="/me.jpg"
        alt="Picture of ME!"
        width={500}
        height={500}
    />
  <div className={style.item}> 
    <p>
      <br></br>
        Hello World!
      <br></br>
      <br></br>
        So I'm new to JavaScript, Next.js and most things front-end.<br></br>
        This is a little personal project of mine to get up to speed.
      <br></br>
      <br></br>
        By all means take a look at how it's coming on and <a href="https://github.com/adamsuk/sradams-co-uk-content">visit on Github!</a>
      <br></br>
      <br></br>
        See you soon!
    </p>
  </div>
  </Layout>;

export default Index
