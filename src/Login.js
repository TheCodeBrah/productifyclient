import React from 'react'
import styles from "./styles/Login.module.css" 
import googleBtn from "./assets/btn_google_signin_dark_pressed_web.png"


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

function Login() {
  return (
    <div className={styles.loginWrapper}>
        <h1 className={styles.loginHeader}>Welcome to Productify. Sign-in to begin your productivity journey </h1>
    <button className={styles.loginButton}><img src={googleBtn} alt='googleSignInBtn' onClick={auth}></img></button>

    </div>
  )
}

export default Login