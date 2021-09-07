import React, { useEffect } from 'react';
import router from 'next/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import initFirebase from './config';
import Layout from '../components/Layout';

initFirebase();
const auth = firebase.auth();

const withAuth = Component => props => {
  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      if (!authUser) {
        router.push('/sandbox/login-portal/signin');
      }
    });
  }, []);

  return (
    <Layout title="Private">
      <Component {...props} />
    </Layout>
  )
};

export default withAuth;