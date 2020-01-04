import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import TaskBaseline from '../components/TaskBaseline'
import NoteBaseline from '../components/NoteBaseline'
import Login from '../components/Login'

import useFirebase from '../hooks/useFirebase'
import useGapi from '../hooks/useGapi'

import '../styles/global.css'

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  },
  appContainer: {
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  loginContainer: {
    height: '100%',
    width: '100%'
  }
}

const Base = () => {
  const { firebaseUser, firebase } = useFirebase()
  const [_gapi, setGapi] = useState(null)
  const gapi = useGapi(_gapi)

  useEffect(() => {
    if (document) {
      if (window.gapi) {
        setGapi(window.gapi)
      }
    }
  }, [firebaseUser])

  return (
    <div style={styles.main}>
      <Head>
        <script src="https://apis.google.com/js/api.js" />
        <link
          href="https://fonts.googleapis.com/css?family=Nunito+Sans&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header firebase={firebase} firebaseUser={firebaseUser} />
      {firebaseUser ? (
        <div style={styles.appContainer}>
          <TaskBaseline
            gapi={gapi}
            firebase={firebase}
            firebaseUser={firebaseUser}
          />
          <NoteBaseline firebase={firebase} firebaseUser={firebaseUser} />
        </div>
      ) : (
        <div className="flex-row-centered" style={styles.loginContainer}>
          <Login gapi={gapi} firebase={firebase} />
        </div>
      )}
    </div>
  )
}

export default Base
