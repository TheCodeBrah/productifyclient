import logo from './logo.svg';
import googleButton from './assets/btn_google_signin_dark_pressed_web.png'
import styles from './styles/App.module.css';
import Homescreen from './Homescreen';
import Dashboard from './Dashboard';




function App() {
  return (
    <div className={styles.App}>
      {/* <Homescreen></Homescreen> */}
      <Dashboard></Dashboard>
     
    </div>
  );
}

export default App;
