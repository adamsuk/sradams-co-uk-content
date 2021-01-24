import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Layout from '../components/Layout'

const About = () => <Layout title="About Me">
  <div>
  <p>
    <br></br>
    Hello World.
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

export default About