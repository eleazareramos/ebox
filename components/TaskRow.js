import React, { useState, useEffect } from 'react'

import GmailIcon from 'mdi-react/GmailIcon'

const styles = {
  main: {
    padding: '5px 10px',
    margin: '5px 10px',
    borderRadius: '5px',
    justifyContent: 'space-between'
  },
  titleText: {
    fontSize: '14px',
    color: 'black',
    paddingLeft: 10,
    textIndent: -10
  },
  mainHovered: {
    backgroundColor: '#b0bec5'
  },
  titleLinkText: {
    textDecoration: 'underline',
    color: '#37474f'
  },
  titleInput: {
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: 12,
    borderBottom: '2px solid white',
    width: '100%',
    marginRight: 10
  }
}

const TaskRow = props => {
  const [task, setTask] = useState({})
  const [inputTitle, setInputTitle] = useState('')
  const [initialTitle, setInitialTitle] = useState('')

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      props.updateTask({ title: inputTitle })
      props.disableEditMode()
    }
    if (e.key === 'Escape') {
      setInputTitle(initialTitle)
      props.disableEditMode()
    }
  }

  useEffect(() => {
    setTask(props.task)
    setInputTitle(props.task.title)
  }, [props.task])

  return (
    <div
      className="flex-row"
      style={
        props.focused ? { ...styles.main, ...styles.mainHovered } : styles.main
      }
    >
      {props.editMode && props.focused ? (
        <input
          ref={props.inputRef}
          style={styles.titleInput}
          value={inputTitle}
          onFocus={() => setInitialTitle(inputTitle)}
          onChange={e => setInputTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          style={
            task.link
              ? { ...styles.titleText, ...styles.titleLinkText }
              : styles.titleText
          }
        >
          {task.title}
        </span>
      )}
      {task.link ? <GmailIcon size={16} color="#37474f" /> : ''}
    </div>
  )
}

export default TaskRow
