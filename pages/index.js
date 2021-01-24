import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import Layout from '../components/Layout'


const Index = () => <Layout>
    <Image
        src="/me.jpg"
        alt="Picture of ME!"
        width={500}
        height={500}
    />
  </Layout>;

export default Index
