import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import 'firebase/auth';
import initFirebase from '../../../../auth/config';
import { setUserCookie } from '../../../../auth/userCookie';
import { mapUserData } from '../../../../auth/useUser';
import Layout from '../../../components/Layout'

initFirebase();

const firebaseAuthConfig = ({ signInSuccessUrl }) => ({
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false
    },
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl,
  credentialHelper: 'none',
  callbacks: {
    signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
      const userData = await mapUserData(user);
      setUserCookie(userData);
    }
  }
});

const FirebaseAuth = () => {
  const signInSuccessUrl = "/sandbox/login-portal"
  return (
    <Layout title="Signin">
      <StyledFirebaseAuth
        uiConfig={firebaseAuthConfig({ signInSuccessUrl })}
        firebaseAuth={firebase.auth()}
        signInSuccessUrl={signInSuccessUrl}
      />
    </Layout>
  );
};

export default FirebaseAuth;
