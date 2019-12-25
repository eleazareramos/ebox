import React, { useState } from 'react'

import PlusIcon from 'mdi-react/PlusIcon'

const styles = {
  main: {
    backgroundColor: '#37474f',
    border: '1px solid lightgrey',
    borderRadius: '10px',
    padding: '5px 10px',
    margin: '10px',
    height: 30
  },
  input: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: '12px',
    border: 'none',
    padding: '0px',
    margin: '0px',
    width: '100%'
  },
  icon: { marginRight: '10px' }
}


const NewTaskInput = props => {
  const [text, setText] = useState('')

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      const title = e.target.value
      props.addTask(title)
      setText('')
    }
    if (e.key === 'Escape'){
      props.inputRef.current.blur()
      props.toggleHotKeys(true)
    }
  }

  return (
    <div className="flex-row" style={styles.main}>
      <PlusIcon color="white" size={14} style={styles.icon} />
      <input
        ref={props.inputRef}
        style={styles.input}
        onKeyDown={handleKeyDown}
        onFocus={() => props.toggleHotKeys(false)}
        onBlur={() => props.toggleHotKeys(true)}
        value={text}
        onChange={e => setText(e.target.value)}
      />
    </div>
  )
}

export default NewTaskInput
