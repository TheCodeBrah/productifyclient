    import React, { useState } from 'react'
import style from './styles/TaskCreator.module.css'
function TaskCreator() {
    const [showTaskCreator, setShowTaskCreator] = useState(false);

  return (
    <div>
        <button onClick={() => {setShowTaskCreator(!showTaskCreator)}}>Create New Task</button>


        <div className={ showTaskCreator ? style.taskCreator: style.taskCreatorHidden}>
            <form>

                <select >
                <option>Choose a Task Priority</option>
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                </select>
            </form>
            Summary: <input></input><br/>
            Description: <input></input><br/>
              
        </div>
        
    </div>
  )
}

export default TaskCreator
