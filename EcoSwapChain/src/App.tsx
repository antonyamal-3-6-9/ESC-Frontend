import './App.css'
import "./index.css"
import { Routes, Route } from 'react-router-dom';
import Register from './Components/Registration/TraderRegistration'
import Login from './Components/Login/Login'
import LandingPage from './Components/LandingPage/LandingPage';


function App() {

  return (
        <div>
          <Routes>
            <Route path='/' element={<><LandingPage/></>} />
            <Route path="/trader/register" element={<Register/>} />
            <Route path='/trader/login' element={<Login/>} />
          </Routes>
        </div>
  )
}

export default App
