import React from 'react'
import styles from './styles/Taskbar.module.css'

function Taskbar({setPage, setIsDashBoard, showSettings, setShowSettings}) {
  return (
    <div className={styles.taskbarContainer}>
      <button className={styles.homeButton} onClick={() => {setPage('dashboard'); setIsDashBoard(true)}}>Home</button>
     
      <button className={styles.settingsButton} onClick={() => {setShowSettings(!showSettings); console.log(showSettings)}}></button>
    </div>
  )
}

export default Taskbar
