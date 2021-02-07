import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Layout from '../components/Layout'

const Music = () => <Layout title="Music">
    <iframe
        style={{
        width: "100%",
        height: "100%"
        }}
        src={`https://www.youtube.com/embed/-XYMdUQPt-0`}
        frameBorder="0"
    />
    </Layout>

export default Music