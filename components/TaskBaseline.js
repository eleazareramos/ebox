import React, { useState, useRef, useEffect } from 'react'

import NewTaskInput from './NewTaskInput'
import TaskRow from './TaskRow'

const styles = {
  main: {
    height: '90%',
    minWidth: '40vw',
    border: '3px solid #37474f',
    borderRadius: '10px',
    margin: '20px',
    overflow: 'auto'
  }
}

const TaskBaseline = props => {
  const [tasks, setTasks] = useState([])
  const [focusedTask, setFocusedTask] = useState(null)
  const [focusedTaskEditMode, setFocusedTaskEditMode] = useState(false)
  const [hotKeysOn, setHotKeysOn] = useState(true)
  const [gmailLabelId, setGmailLabelId] = useState(null)

  const taskAppRef = useRef(null)
  const newTaskInputRef = useRef(null)
  const taskInputRef = useRef(null)

  const getTasks = async () => {
    const taskQuery = await props.firebase
      .firestore()
      .collection('tasks')
      .where('user', '==', props.firebaseUser.uid)
      .get()

    const taskArray = taskQuery.docs.map(task => ({
      ...task.data(),
      id: task.id
    }))
    const taskMap = taskArray.reduce((map, task) => {
      map[task.id] = { ...task }
      return map
    }, {})

    const sortedTasks = []

    const userOrder = props.firebaseUser.order || []
    userOrder.forEach(taskId => sortedTasks.push(taskMap[taskId]))
    taskArray
      .filter(task => !userOrder.includes(task.id))
      .forEach(task => sortedTasks.push(task))

    const sortedTaskIds = sortedTasks.map(t => t.id)

    await props.firebase
      .firestore()
      .collection('users')
      .doc(props.firebaseUser.uid)
      .update({ order: sortedTaskIds })

    setTasks(sortedTasks)
  }

  const addTask = async (title, link) => {
    const newTask = {
      title,
      user: props.firebaseUser.uid,
      link: link || ''
    }
    const task = await props.firebase
      .firestore()
      .collection('tasks')
      .add(newTask)

    const taskId = task.id

    setTasks([...tasks, { ...newTask, id: taskId }])
  }

  const toggleHotKeys = bool => {
    if (bool) {
      taskAppRef.current.focus()
    } else {
      taskAppRef.current.blur()
    }
    setHotKeysOn(bool)
  }

  const updateFocusedTask = async params => {
    const task = tasks[focusedTask]
    const taskId = task.id

    const _tasks = tasks.map(t => {
      if (t.id === taskId) return { ...t, ...params }
      return { ...t }
    })

    setTasks(_tasks)

    await props.firebase
      .firestore()
      .collection('tasks')
      .doc(taskId)
      .update(params)
  }

  const deleteTask = async index => {
    const task = tasks[index]
    await props.firebase
      .firestore()
      .collection('tasks')
      .doc(task.id)
      .delete()

    const _tasks = tasks.filter(t => t.id !== task.id)
    setTasks(_tasks)
  }

  const handleKeyDown = e => {
    if (!hotKeysOn) return
    const len = tasks.length
    if (e.key === 'j' && !(e.ctrlKey || e.metaKey)) {
      if (!focusedTask && focusedTask !== 0) return setFocusedTask(0)
      if (focusedTask === len - 1) return setFocusedTask(0)
      return setFocusedTask(Math.min(len, parseInt(focusedTask, 10) + 1))
    }
    if (e.key === 'k' && !(e.ctrlKey || e.metaKey)) {
      if (!focusedTask) return setFocusedTask(len - 1)
      return setFocusedTask(Math.max(0, parseInt(focusedTask, 10) - 1))
    }
    if (e.key === 'd') {
      if (focusedTask >= 0) {
        deleteTask(focusedTask)
      }
    }
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'k') {
        moveFocusedTask(-1)
      }
      if (e.key === 'j') {
        moveFocusedTask(1)
      }
    }
    if (e.key === 'g') {
      getGmailMessages()
    }
    if (e.key === 'o') {
      openFocusedTaskLink()
    }
    if (e.key === 'Enter' && focusedTask >= 0) {
      setFocusedTaskEditMode(true)
      toggleHotKeys(false)
    }
  }

  const handleKeyUp = e => {
    if (!hotKeysOn) return
    if (e.key === 'n') {
      newTaskInputRef.current.focus()
      return
    }
  }

  const openFocusedTaskLink = () => {
    const task = tasks[focusedTask]
    if (task.link) {
      window.open(task.link)
    }
  }

  const getGmailLabel = async () => {
    const gapiUid = props.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getId()

    const labelApi = props.gapi.client.gmail.users.labels

    const labels = await labelApi.list({
      userId: gapiUid
    })

    const labelSearch = labels.result.labels.filter(l => l.name === 'ebox')
    let label = labelSearch.length > 0 ? labelSearch[0] : null

    if (!label) {
      const newLabel = await labelApi.create({
        userId: gapiUid,
        name: 'ebox'
      })

      label = newLabel
    }

    setGmailLabelId(label.id)
  }

  useEffect(() => {
    if (props.gapi) {
      getGmailLabel()
    }
  }, [props.gapi])

  const getGmailMessages = async () => {
    const gapiUid = props.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getId()

    const gmail = props.gapi.client.gmail

    const threads = await gmail.users.threads.list({
      userId: gapiUid,
      q: 'label:ebox'
    })

    if (threads.result.resultSizeEstimate === 0) return

    let _threads = []
    for (let thread of threads.result.threads) {
      const _thread = await gmail.users.threads.get({
        userId: gapiUid,
        id: thread.id
      })
      const messageHeaders = _thread.result.messages[0].payload.headers
      const subjectHeader = messageHeaders.filter(h => h.name === 'Subject')
      const subject =
        subjectHeader.length > 0 ? subjectHeader[0].value : 'unknown'
      _threads.push({
        subject,
        threadId: thread.id
      })

      await gmail.users.threads.modify({
        userId: gapiUid,
        id: thread.id,
        removeLabelIds: [gmailLabelId]
      })
    }

    const threadTasks = _threads.map(t => ({
      title: t.subject,
      link: `https://mail.google.com/mail/u/0/#inbox/${t.threadId}`,
    }))

    let _tasks = []
    for (let task of threadTasks){
      const newTask = await props.firebase
        .firestore()
        .collection('tasks')
        .add(task)
      
      const newTaskId = newTask.id
      _tasks.push({...task, id: newTaskId})
    }

    setTasks([...tasks, ..._tasks])
    
  }

  const moveFocusedTask = offset => {
    const oi = focusedTask
    const task = tasks[focusedTask]

    const priorTasks = tasks.slice(0, oi)
    const nextTasks = tasks.slice(oi + 1, tasks.length)

    let switchedTask
    let orderedTasks = [...priorTasks, task, ...nextTasks]

    if (offset === 1) {
      if (focusedTask === tasks.length - 1) return
      switchedTask = nextTasks[0]
      const next = nextTasks.slice(1, nextTasks.length)
      orderedTasks = [...priorTasks, switchedTask, task, ...next]
    }
    if (offset === -1) {
      if (focusedTask === 0) return
      switchedTask = priorTasks[priorTasks.length - 1]
      const prior = priorTasks.slice(0, priorTasks.length - 1)
      orderedTasks = [...prior, task, switchedTask, ...nextTasks]
    }

    setTasks(orderedTasks)
    setFocusedTask(focusedTask + offset)
  }

  const setUserOrder = async () => {
    await props.firebase
      .firestore()
      .collection('users')
      .doc(props.firebaseUser.uid)
      .update({ order: tasks.map(t => t.id) })
  }

  useEffect(() => {
    if (focusedTaskEditMode) {
      taskInputRef.current.focus()
    }
  }, [focusedTaskEditMode])

  useEffect(() => {
    if (props.firebaseUser) {
      getTasks()
    }
  }, [props.firebaseUser])

  useEffect(() => {
    if (props.firebase && props.firebaseUser) {
      setUserOrder()
    }
  }, [tasks])

  return (
    <div
      ref={taskAppRef}
      tabIndex={0}
      style={styles.main}
      onKeyUp={handleKeyUp}
      onKeyDown={handleKeyDown}
    >
      <NewTaskInput
        firebase={props.firebase}
        inputRef={newTaskInputRef}
        addTask={addTask}
        hotKeysOn={hotKeysOn}
        toggleHotKeys={toggleHotKeys}
      />
      {tasks
        .sort((a, b) => a.order - b.order)
        .map((task, i) => (
          <TaskRow
            key={i}
            order={i}
            task={task}
            focused={i === focusedTask}
            editMode={focusedTaskEditMode}
            setFocusedTask={setFocusedTask}
            inputRef={taskInputRef}
            disableEditMode={() => {
              setFocusedTaskEditMode(false)
              toggleHotKeys(true)
            }}
            updateTask={updateFocusedTask}
          />
        ))}
    </div>
  )
}

export default TaskBaseline
