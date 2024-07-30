import React from 'react'
import {useState} from 'react'
import Redirect from './Redirect'
import Task from './Task.js'
import "./styles/App.module.css"
import logo from "./logo.jpg"
import Notes from './Notes.js'
function  Homescreen() {
    const [content, setContent] = useState("home")


  return (

    <div className='home-screen-wrapper'>
        <img src={logo} alt='logo' onClick={() => {setContent("home")}} className='logo' draggable="false"></img>

        { content === "home" && <div className="homescreen">
        
            <h1 className='home-screen-text'>Homescreen</h1>

            <div className='button1'>
              
            <Redirect name="Task Menu" setContent={setContent} content={<Task/>}></Redirect>
            <Redirect name="Notes" setContent={setContent} content={<Notes/>}></Redirect>
                </div>
        </div>} 

        { content !== "home" && <div className='content'>
            {content}
        </div>}
    </div>
  )
}

export default Homescreen