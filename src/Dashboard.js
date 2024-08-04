import React, { useEffect, useState } from 'react'
import styles from "./styles/Dashboard.module.css"
import logo from "./assets/logo.png"
import axios from "axios";
import Task from './Task';
import DashboardCalendar from './DashboardCalendar';
import Calendar from './Calendar'
import googleButton from './assets/btn_google_signin_dark_pressed_web.png'
import settingsBtn from './assets/settings-cog-gray-outline.png'
import Login from './Login'

function navigate(url) {
  window.location.href = url

}

async function auth() {
  const response = await fetch('http://localhost:5000/api/auth/login', 
    {method:'post'});
    const data = await response.json();
    console.log(data)
    navigate(data.url);
  
}
async function getCookie(cname){
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
}

function Dashboard() {
  const [isDashBoard, setIsDashBoard] = useState(true)
  const [page, setPage] = useState()
  const [tasks, setTasks] = useState(undefined)
  const [showSettings, setShowSettings] = useState(undefined)
  const [calendarStyle, setCalendarStyle] = useState("calendar-wrapper")
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const getDate = new Date()
  const [year, setYear] = useState(getDate.getFullYear())
  const [month, setMonth] = useState(getDate.getMonth() + 1)
  // axios.defaults.withCredentials = true
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    headers: {
      
      'Access-Control-Allow-Origin': "http://localhost:3000/",
      'Access-Control-Allow-Credentials': "true"
    },
    
  });


  

let taskMap
  if(tasks !== undefined) {
    taskMap = tasks.map((task) => {return (<li key={task.id}>{task.name}</li>)})
  }


//Run when dashboard loads

  useEffect(() => {
  
    //check for stored userData
    async function userInfo(){
      api.get('/auth/userinfo').then((res) => {
        console.log(res)
        if(res.data){
          localStorage.setItem('username', res.data.name)
          localStorage.setItem('usersub', res.data.sub)
          console.log(`${localStorage.getItem("username")}, ${localStorage.getItem('usersub')}`)
        }
      })
    }
    userInfo()
   
    getTasks()
    console.log("pageLoaded")
    //check if google authentication is still valid
    const checkGoogleAuthStatus = async () => {
      const at = await getCookie("accesstoken")
      console.log(at)
     
      
      
      const response = await api.post('/auth/verify', {sub:localStorage.getItem('usersub')}).then((res) => res.data).catch((err) => {console.log(err)})
      
     return(response)
    }
   
    //Everything past this point requires google authentication in order to work
    
    checkGoogleAuthStatus().then((res) => {
      
      if(res){
        console.log(res)
       
        setIsAuthenticated(true)
        getCalendarEvents()

      } 
      if(!res){
        console.log(res)
        setIsAuthenticated(false)
      }
    })
    
  }, [isDashBoard])

  //Get list of all tasks from server
  function getTasks(){

    api.get("/alltasks").then(async (res) => {
      setTasks(tasks => tasks = res.data)
     
    })

    
  }
  async function getCalendarEvents(){
   const at = await getCookie('accesstoken')
    const now = new Date()
    const getmonth = now.getMonth() + 1
    const getyear = now.getFullYear()
    const daysInMonth = (getyear, getmonth) => new Date(getyear, getmonth, 0).getDate();
    const totalDays = daysInMonth(getyear, getmonth)
 
    setYear(getyear)
    setMonth(getmonth)
    console.log(`years n shi: ${daysInMonth(year, month)}, ${month}, ${year}`)
   
  }
  function redirectToCalendar() {
    setIsDashBoard(false); setPage(<Calendar getCookie={getCookie} month={month} year={year}/>)
  }

  // Return of Dashboard Component
  return (
    <>
   
    {showSettings !== undefined && <div className={showSettings ? styles.settings : styles.settingsHide}> 
      <button 
      className={styles.login} 
      onClick={() => {auth()}}>
      <img 
      src={googleButton}
      alt='googleButton'/>
       
       </button> 
       
       </div>}
   {/* <button className='login' onClick={() => {auth()}}><img src={googleButton} alt='googleButton'></img></button> */}
    <div className={styles.navBar}>
     <img src={logo} alt='logo' onClick={() => {setIsDashBoard(true)}} className={styles.logo} draggable="false"></img>
    <img className={styles.settingsButton} onClick={() => {setShowSettings(!showSettings); console.log(showSettings)}} alt="settingsButton"  src={settingsBtn}></img>
    </div>
    {/* Dashboard Code */}
    
    {(isDashBoard && isAuthenticated) &&
    <div className={styles.dashboard}>
      <div className={styles.leftMenu}>
        <div className={styles.taskWrapper} onClick={() => { setIsDashBoard(false); setPage(<Task/>)}}>
          <div className={styles.tasks}>
          <h1 className={styles.taskTitle}>Tasks</h1>
          {taskMap}
          </div>
          </div>
              {isAuthenticated ? 
              <div className={styles.calendarWrapper}>
            
          <DashboardCalendar getCookie={getCookie} redirect={redirectToCalendar} month={month} year={year} setMonth={setMonth} setYear={setYear}></DashboardCalendar>
                </div>
           : 
          <div
              className={styles.calendarWrapper}
              >You must authenticate with google before accessing this feature, try checking your settings to login</div>
              }

      </div>
    </div>
    }
    {/* shows the page that you click on after leaving the dashboard */}
    {(!isDashBoard && isAuthenticated)  && <> {page} </>}
      
   
{/* Login Screen*/}
    {!isAuthenticated && <Login/>}
    </>
  )
}

export default Dashboard