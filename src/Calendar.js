import React, {useEffect, useState, } from 'react'
import axios from 'axios';
import styles from "./styles/Calendar.module.css"
function Calendar({getCookie, month, year}) {
  const [view, setView] = useState('Month')
  const [dayView, setDayView] = useState()
  const [dayViewProps, setDayViewProps] = useState()
  const [curMonth, setCurMonth] = useState(month)
  const [curYear, setCurYear] = useState(year)
  const [showMonth, setShowMonth] = useState()
  const [isLoggedIn, setIsLoggedIn] = useState()
  const [days, setDays] = useState([])
  const [event, setEvent] = useState()
 
  const [eventMaker, setEventMaker] = useState({})
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    headers: {
      
      'Access-Control-Allow-Origin': "http://localhost:3000/",
      'Access-Control-Allow-Credentials': true
    },
    
  });
  // loads calendar on page load
  useEffect(() => {
    loadCalendar()
    const date = new Date()
    
    console.log(date.getFullYear())
  }, [])

  //Changes the Month Label
  useEffect(() => {
    console.log(days)
    switch(curMonth){
      case 1:
        setShowMonth('January')
        break;
      case 2:
        setShowMonth('February')
        break;
      case 3:
        setShowMonth('March')
        break;
      case 4:
        setShowMonth('April')
        break;
      case 5:
        setShowMonth('May')
        break;
      case 6:
        setShowMonth('June')
        break;
      case 7:
        setShowMonth('July')
        break;
      case 8: 
        setShowMonth('August')
        break;
      case 9:
        setShowMonth('September')
        break;
      case 10:
        setShowMonth('October')
        break;
      case 11:
        setShowMonth('November')
        break;
      case 12:
        setShowMonth('December')
        break;   
      default:
        break;
    }
  }, [curMonth])
  //get how many days in a given month and year for leap year
  function getDays(year, month){
  switch (month) {
    
    case 1:
      return 31
   
    case 2:
      if (year % 4 === 0){
        return(29)
      } else{
        return(28)
      }
     
    case 3:
      return(31)

    case 4:
      return(30)

    case 5:
      return(31)
    case 6:
      return(30)
    case 7:
      return(31)
    case 8:
      return(31)
    case 9:
      return(30)
    case 10:
      return(31)
    case 11:
      return(30)
    case 12:
      return(31)
    default:
      console.log("You did not enter a valid month")
      break;
  }}
  //Get cookie for Access Token
  
//send request to backend to get the Calendar Events
async function getCalendarEvents(cookie, days, month, year, newDayList) {
  await getCookie(cookie).then((res) => {api.post('/calendar', {at:res, month:month, year:year, days:days},).then((res) => {
    console.log(res)
    if (res.status === 200){
    if (res.data.items.length !== 0){
      setEvents(res.data.items, newDayList)
  }}
  }).catch((err) => {alert(err)})})
}
//create a new event
 async function newEvent(timeMax, timeMin, eventSummary, eventDescription, ) {
  let cookie = await getCookie("accesstoken")
  console.log(cookie)
    const ep = eventMaker
    let eventBody
    if (ep.timeMin && ep.timeMax){
       eventBody = {
        summary:ep.summary ,
        description: ep.description,

        start: {
          dateTime: ep.timeMin + ":00Z",
          timeZone: 'America/Los_Angeles'
        },
        end: {
          dateTime: ep.timeMax + ":00Z",
          timeZone: 'America/Los_Angeles'
        },     
}
    }
    if(!ep.timeMin && !ep.timeMax){
       eventBody = {
        summary:ep.summary ,
        description: ep.description,

        start: {
          date: `${curYear}-${curMonth}-${dayViewProps.id}`,
          timeZone: 'America/Los_Angeles'
        },
        end: {
          date: `${curYear}-${curMonth}-${dayViewProps.id}`,
          timeZone: 'America/Los_Angeles'
        },     
}
    }
  console.log(ep)
  api.post('/calendar/insert', {body: eventBody, at:cookie })
  console.log(eventBody)
 }
 
 async function deleteEvent(id){
  let cookie = await getCookie("accesstoken")
  api.post('/calendar/delete', {id:id, at:cookie})

}

 
 //adds Events from Gapi to frontend calendar
 function setEvents(dates, newDayList){
    for (let i = 0; i in dates; i++){
      console.log(dates)
      let bd = ""
        if (dates[i].start.dateTime){
         bd = dates[i].start.dateTime.split(/[- , T]+/)}
        if(dates[i].start.date){
           bd = dates[i].start.date.split("-")
        }
        console.log(dates[i].start.dateTime)
        const bdYear = bd[0]
        const bdMonth = bd[1]
        const bdDay = bd[2]
        
        console.log(newDayList)

        const filteredDay = newDayList.filter((d) => d[0].id === parseInt(bdDay))
        let dayInsert
        console.log(filteredDay)
        if (!filteredDay[0][0].summary){
          dayInsert = 0
        }else{
        dayInsert = filteredDay.length
      }
        console.log(filteredDay)
        filteredDay[0][dayInsert] = {}
        filteredDay[0][dayInsert].summary = dates[i]?.summary
        filteredDay[0][dayInsert].description = dates[i]?.description
        filteredDay[0][dayInsert].gapi_id = dates[i]?.id
        filteredDay[0][dayInsert].id = parseInt(bdDay)
        const filteredList = newDayList.filter((d) => d[0].id !== parseInt(bdDay))
        const finalList = [...filteredList, ...filteredDay]
        const orderedFinalList = finalList.sort((a, b) => a[0].id - b[0].id)
        setDays(days => days = orderedFinalList)
    }
 }
//Calendar Loading
 function loadCalendar(direction) {
  let month = curMonth
  let year = curYear
  //determines Changes in month and year
  if (direction ==="forward"){
    month = curMonth+1
  }if(direction === "backward"){
    month = curMonth-1
  }if(month < 1){
    month = 12
    year = curYear - 1
    setCurMonth(c=> c = 12)
    setCurYear(cy => cy - 1)
  }
  if(month > 12){
    month = 1
    year = curYear+1
    setCurMonth(c=> c = 1)
    setCurYear(cy => cy + 1)

  }


  //gets the amount of day in a month
  const dim = getDays(year, month)
  
  //reset calendar days to be refilled by new days
    setDays(days => days = [])
    let newDayList = []
   //refills calendar with new days
      for ( let i = 1 ; i <= dim; i++){
          newDayList = [...newDayList, [{id:i, summary:'', description:''}]]
      }
      setDays(newDayList)
      getCalendarEvents('accesstoken', dim, month, year, newDayList)
     
      console.log(newDayList)
 }
 //maps all calendar days to a variable to be shown on monthly screen

 const calendarDays = days.map((day) => { 
  const newDay = day.map((d) =>  {
    // console.log(d);
  return(
    <p key={d.gapi_id}>{d.summary}</p>
    )
  }); return(


 <div 
  key={day[0].id} 
  className={styles.calendarDay} 
  onClick={() => {
    setDayViewProps({summary:day[0].summary, id:day[0].id, description:day[0].description, gapi_id:day[0].gapi_id})
    console.log(day)
    createDayViewMap(day[0].id)
    setView("Day")
  }}>
 <p style={{marginTop:0}}>{day[0].id}</p> 

{newDay}
  </div>)})
 

  let dayViewMap
  function createDayViewMap(day) {
    
    //api.post('/calendar/delete', {id:dayViewProps.gapi_id})}
    console.log(days[0][0])
    const filtered = days.filter(d => d[0].id === day)
    console.log(filtered)
    dayViewMap = filtered[0].map((d) => {
      console.log(d.gapi_id)
      return(<div>
        <p key={d.gapi_id}>{d.summary}</p> <button onClick={() => {deleteEvent(d.gapi_id)}}>Delete</button></div>
        )
        
    })
    console.log(dayViewMap)
    setDayView(dayViewMap)
  }
  //Component Return
  return (
    
    
      <>
  {/* Calendar */}


  {view === 'Month' && 
      <>
     <div className={styles.calendarNav}><button className={styles.navButton} onClick={() => {setCurMonth(curMonth-1); loadCalendar("backward") }}> left button </button><h1>{showMonth} {curYear} </h1><button className={styles.navButton} onClick={() => {setCurMonth(curMonth+1); loadCalendar("forward")}}>right button</button> </div>
    <div className={styles.calendarWrapper}>
   
  <div className={styles.calendarBody}>
   {calendarDays} 
  </div>
    </div>
  
  {/* Navigation Bar */}

     </>}
     {view === "Day" && 
     <>
     <div className={styles.dayViewWrapper}>

      {dayView}

      <button onClick={() => {setView("EventMaker"); console.log(view)}}>Create New Event</button>
      <button
       onClick={() => {setView("Month")}}
       >
        Back To Calendar
        </button>
     </div>
     
    
     </>}
     {view === "EventMaker" &&  
     <div className={styles.eventMaker}>
      <input placeholder='Input Event Description' onChange={(e) => {setEventMaker(em => em = {timeMax:em.timeMax, timeMin:em.timeMin, summary:em.summary, description:e.target.value, })}}></input>
      <input placeholder='Input Event Summary' onChange={(e) => {setEventMaker(em => em = {timeMax:em.timeMax, timeMin:em.timeMin, summary:e.target.value, description:em.description, })}}></input>
      <p>End Time</p>
      <input type="datetime-local" onChange={(e) => {setEventMaker(em => em = {timeMax:e.target.value, timeMin:em.timeMin, summary:em.summary, description:em.description, })}}></input>
      <p>Start Time</p>
      <input type="datetime-local" onChange={(e) => {setEventMaker(em => em = {timeMax:em.timeMax, timeMin:e.target.value, summary:em.summary, description:em.description, })}}></input>
      <button onClick={() => {newEvent()}}>Create Thing</button>
     </div>}
    </>
    
  )
}

export default Calendar
