import React, { useState, useEffect } from 'react'

const styles = {
  main: {
    height: '90%',
    width: '100%',
    borderRadius: '10px',
    margin: '20px',
    overflow: 'auto',
    border: '3px solid #37474f',
  }, 
  text: {
    backgroundColor: '#37474f',
    height: '100%',
    width: '100%',
    padding: 20,
    fontSize: 12,
    color: 'white',
    border: 'none'
  }
}

const NoteBaseline = props => {
  const [note, setNote] = useState('')

  const updateNote = async note => {
    setNote(note)
    await props.firebase
      .firestore()
      .collection('users')
      .doc(props.firebaseUser.uid)
      .update({ note })
  }

  const getNote = async () => {
    const userRef = await props.firebase
      .firestore()
      .collection('users')
      .doc(props.firebaseUser.uid)
      .get()

    const _note = userRef.data().note || ''
    setNote(_note)
  }

  useEffect( () => {
    if(props.firebase && props.firebaseUser){
      getNote()
    }
  }, [props.firebase, props.firebaseUser])


  return (
    <div style={styles.main} tabIndex={1}>
      <textarea 
        style={styles.text}
        value={note}
        onChange={ e => updateNote(e.target.value)}
      />
    </div>
  )
}

export default NoteBaseline
