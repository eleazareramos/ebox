import React, { useState } from 'react'

const styles = {
  main: {
    height: '5vh',
    padding: '0px 10px',
    fontSize: '18px',
    justifyContent: 'space-between',
    backgroundColor: '#607d8b'
  },
  title: {
    color: 'white'
  },
  logout: {
    fontSize: 12,
    color: 'white'
  },
  email: {
    fontSize: 12,
    color: 'lightgrey',
    marginRight: 10
  }
}

const Header = props => {
  const logout = () => {
    props.firebase.auth().signOut()
  }

  return (
    <div className="flex-row" style={styles.main}>
      <span style={styles.title} className="clickable-text">
        ebox
      </span>
      {props.firebaseUser ? (
        <div className="flex-row">
          <span
            style={styles.email}
          >
            {props.firebaseUser.email}
          </span>
          <span
            style={styles.logout}
            className="clickable-text"
            onClick={logout}
          >
            logout
          </span>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Header
