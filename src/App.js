import logo from './logo.svg';
import googleButton from './assets/btn_google_signin_dark_pressed_web.png'
import styles from './styles/App.module.css';

import Dashboard from './Dashboard';
import Taskbar from './Taskbar';

import { useState } from 'react';


function App() {
  const [isDashBoard, setIsDashBoard] = useState(true)
  const [page, setPage] = useState()
  const [showSettings, setShowSettings] = useState(undefined)
  return (
    <div className={styles.App}>
      {/* <Homescreen></Homescreen> */}
      <Taskbar showSettings={showSettings} setShowSettings={setShowSettings} setPage={setPage} isDashBoard={isDashBoard} setIsDashBoard={setIsDashBoard}></Taskbar>
      <Dashboard showSettings={showSettings} setShowSettings={setShowSettings} page={page} setPage={setPage} isDashBoard={isDashBoard} setIsDashBoard={setIsDashBoard}></Dashboard>
      
     {/* <NewDashboard></NewDashboard> */}
    </div>
  );
}

export default App;
