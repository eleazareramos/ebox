import React from 'react'

const styles = {
  text: {
    color: 'black',
    fontWeight: 'bold'
  }
}

const Login = props => (
  <span
    className="clickable-text"
    style={styles.text}
    onClick={async () => {
      const googleAuth = props.gapi.auth2.getAuthInstance()
      const googleUser = await googleAuth.signIn()
      const token = googleUser.getAuthResponse().id_token
      const credential = props.firebase.auth.GoogleAuthProvider.credential(token)
      await props.firebase.auth().signInAndRetrieveDataWithCredential(credential)
    }}
  >
    login
  </span>
)

export default Login
