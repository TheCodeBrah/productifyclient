import { React, useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles/App.module.css";
function Task() {
  //Database
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    headers: {
      
      'Access-Control-Allow-Origin': "http://localhost:3000/",
      'Access-Control-Allow-Credentials': true
    },
    
  });
  function sendData(data) {
    api
      .post("/tasks", data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function replaceData(data) {
    console.log(data);
    api.post("/replacetask", data).catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    console.log("page Loaded");
    api
      .get("/task")
      .then((res) => {
        if (res.data[0].id !== undefined) {
          setId(res.data[0].id + 1);
        }
        console.log(res.data[0].id);
      })
      .catch((err) => {
        console.log(err);
      });
    api
      .get("/alltasks")
      .then((res) => {
        setTaskList(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setOrderLength((o) => (o = taskList.length));
  }, []);
  //Task Creation
  const [curTask, setCurTask] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState(0);
  const [editId, setEditId] = useState();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [orderLength, setOrderLength] = useState(0);
  const [grabbedText, setGrabbedText] = useState({
    state: false,
    text: undefined,
    order: undefined,
    id: undefined,
  });

  //Main List
  const listItems = taskList
    .sort(function (a, b) {
      return a.order - b.order;
    })
    .map((task) => {
      return (
        <li key={task.id}>
          {" "}
          {editing ? editId === task.id && (
                //Confirm Button
                <button
                  key={task.id}
                  onClick={() => {
                    setTaskList([
                      ...taskList.filter((t) => t.id !== task.id),
                      { name: curTask, id: task.id, order: orderLength },
                    ]);
                    replaceData({
                      name: curTask,
                      id: task.id,
                      order: orderLength,
                    });
                    setEditing(false);
                    setCurTask("");
                  }}
                >
                  Confirm
                </button>
              )
            : editMode && (
                //Edit Button
                <button
                  key={task.id}
                  onClick={() => {
                    setCurTask(task.name);
                    setEditing(true);
                    setEditId(task.id);
                  }}
                >
                  Edit
                </button>
              )}
          {/*listText*/}
          <span
            className={styles.taskName}
            onClick={() => {
              console.log(task.order);
              if (!grabbedText.state) {
                pickupText({ text: task.name, order: task.order, id: task.id });
              } else {
                moveText(grabbedText.order, task.order);
                setGrabbedText(
                  (gt) =>
                    (gt = { state: false, text: undefined, order: undefined })
                );
              }
            }}
          >
            {task.name}
          </span>
          {/*remove button*/}
          {
            <button
              className={styles.removeButton}
              onClick={() => {
                setTaskList(taskList.filter((t) => t.id !== task.id));
                console.log(task.id);
                setOrderLength((Ol) => Ol - 1);
                api
                  .post("/deltask", { id: task.id })
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              Remove Task
            </button>
          }
        </li>
      );
    });

  useEffect(() => {
    async function setOrder() {
      setOrderLength((o) => (o = taskList.length));
    }

    setOrder().then(() => {
      console.log(orderLength);
    });
  }, [orderLength]);
  //Move Order
  async function moveText(dynamic, moved, id) {
    //Moving Up
    if (dynamic > moved) {
      const moveTo = taskList.filter((task) => task.order === dynamic);

      const filtered = taskList.filter((task) => task.order < dynamic);
      const doubleFilter = filtered.filter((task) => moved <= task.order);
      console.log(moved);
      moveTo[0].order = moved;
      console.log(doubleFilter);
      let deranked = [];
      doubleFilter.forEach((task) => {
        task.order += 1;
        console.log(task);
        deranked = [...deranked, task];
      });

      console.log(deranked);
      const staticTasks = taskList.filter((task) => task.order > dynamic);
      const staticTasks2 = taskList.filter((task) => task.order < moved);
      const staticFinal = [...staticTasks, staticTasks2];
      console.log(staticTasks);
      setTaskList([...moveTo, ...deranked, ...staticTasks, ...staticTasks2]);
      taskList.forEach((task) => {
        console.log(task);
        replaceData({ name: task.name, id: task.id, order: task.order });
      });
    }
    //Moving Down
    if (dynamic < moved) {
      const moveTo = taskList.filter((task) => task.order === dynamic);

      const filtered = taskList.filter((task) => dynamic < task.order);
      const doubleFilter = filtered.filter((task) => moved >= task.order);
      console.log(filtered);
      console.log(doubleFilter);
      moveTo[0].order = moved;
      console.log(doubleFilter);
      let deranked = [];
      doubleFilter.forEach((task) => {
        task.order -= 1;
        console.log(task);
        deranked = [...deranked, task];
      });

      const staticTasks = taskList.filter((task) => dynamic > task.order);
      const staticTasks2 = taskList.filter((task) => moved < task.order);
      const staticFinal = [...staticTasks, ...staticTasks2];
      console.log(staticTasks);
      console.log(staticTasks2);
      console.log(staticFinal);
      setTaskList([...moveTo, ...deranked, ...staticFinal]);
      taskList.forEach((task) => {
        replaceData({ name: task.name, id: task.id, order: task.order });
      });
    }
    console.log(taskList);
  }
  //Pick Up Task

  function pickupText({ text, order, id }) {
    document.onmousemove = function (e) {
      var x = e.pageX;
      var y = e.pageY;
      setMousePos({ x: x, y: y });
    };

    setGrabbedText({ state: true, text: text, order: order, id: id });
  }
  return (
    <>
      <div className={styles.container}>
        <div>
          <button
            onClick={() => {
              setTaskList([
                ...taskList,
                { name: curTask, id: id, order: orderLength + 1 },
              ]);
              sendData({ name: curTask, id: id, order: orderLength + 1 });
              setOrderLength((ol) => ol + 1);
              setId((id) => id + 1);
              setCurTask("");
            }}
          >
            Log Task
          </button>
          <input
            style={{ textAlign: "center" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setTaskList([
                  ...taskList,
                  { name: curTask, id: id, order: orderLength + 1 },
                ]);
                sendData({ name: curTask, id: id, order: orderLength + 1 });
                setOrderLength((ol) => ol + 1);
                setId((id) => id + 1);
                setCurTask("");
              }
              console.log(e.key);
            }}
            onChange={(e) => {
              setCurTask(e.target.value);
            }}
            value={curTask}
            placeholder={!editing ? "Input Task" : "Enter Edited Task"}
          ></input>

          <button
            onClick={() => {
              setEditMode(!editMode);
            }}
          >
            {!editMode ? "Task Mode" : "Edit Mode"}
          </button>
        </div>
        <ul className={styles.taskContainer}>{listItems}</ul>

        {grabbedText.state && (
          <p
            style={{
              position: "fixed",
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
            }}
          >
            {grabbedText.text}
          </p>
        )}
      </div>
    </>
  );
}

export default Task;
