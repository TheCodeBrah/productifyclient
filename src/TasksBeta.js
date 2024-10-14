import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';
import styles from "./styles/Tasks.module.css"
import TaskCreator from './TaskCreator';
function TasksBeta() {

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    headers: {
      
      'Access-Control-Allow-Origin': "http://localhost:3000/",
      'Access-Control-Allow-Credentials': "true"
    },
    
  });


  const [tasksList, setTaskList] = useState([]);
  useEffect(() => {  setTaskList([{taskName:"boop", description:"this a task that will be done", id:1, start:"12:00", end:"12:00", parent:"none", prio: 2, year:2024, day:12, month:"04"}, {taskName:"boop", id:2},{taskName:"boop", id:3},{taskName:"boop", id:4},{taskName:"boop", id:5},{taskName:"boop2", id:6}])}, [])

  function createTaskCalendarEvent(task){
   const taskBody = {
      summary: task.taskName,
      description: `${task.prio}|${task.parent}|${task.description}`,
      start: {
        date: `${task.year}-${task.month}-${task.day}`,
        timeZone: 'America/Los_Angeles'
      },
      end: {
        date: `${task.year}-${task.month}-${task.day}`,
        timeZone: 'America/Los_Angeles'
      },    

    }
    
    api.post("/tasks/insert", {taskBody})

  }

  function getTaskPrio(input){
    if(input.prio === 2){
      return "green"
    }
    if(input.prio === 1){
      return "blue"
    }
    if(input.prio === 0){
      return "red"
    }
  }

  
  return (
<div className={styles.tasksContainer}>
    <div className={styles.tasksContent}>
    {
      //list Tasks
    }

    {tasksList.map(task => {return(
    
    <div key={task.id} className={styles.task}>{task.taskName}</div>
   

    )})}
    </div>
    
    {/* <button className={styles.createTaskBtn} onClick={() => {
    createTaskCalendarEvent(tasksList[0]);
    }}>+</button> */}
    <TaskCreator></TaskCreator>


    
    </div>
  )
}

export default TasksBeta
