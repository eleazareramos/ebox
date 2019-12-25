import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

const useFirebase = () => {
  const [firebaseUser, setFirebaseUser] = useState(null)

  useEffect(() => {
    !firebase.apps.length
      ? firebase.initializeApp(FIREBASE_CONFIG)
      : firebase.app()

    firebase.auth().onAuthStateChanged(async authUser => {
      if (authUser) {
        const usersCollection = firebase.firestore().collection('users')
        let _firebaseUser = {}
        const _user = await usersCollection.doc(authUser.uid).get()

        if (_user.exists) {
          _firebaseUser = { ...authUser, ..._user.data() }
        } else {
          await usersCollection.doc(authUser.uid).set({ order: [] })
          _firebaseUser = {...authUser, order: []}
        }
        setFirebaseUser(_firebaseUser)
      } else {
        setFirebaseUser(null)
      }
    })
  }, [])

  return { firebaseUser, firebase }
}

export default useFirebase
