
import "./styles/App.module.css"
function Redirect({name, setContent, content}) {
 
    function redirectFunc() {
        setContent(content)
    }

  return (
    
    <div><button onClick={redirectFunc} className="redirectButton">{name}</button></div>
  )
}

export default Redirect