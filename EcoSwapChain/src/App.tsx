import './App.css'
import './index.css'
import { Routes, Route } from 'react-router-dom'
import Register from './Components/Registration/TraderRegistration'
import Login from './Components/Login/Login'
import LandingPage from './Components/LandingPage/LandingPage'
import { useDispatch } from 'react-redux'
import { checkAuth } from './Redux/userActions'
import { useEffect } from 'react'

function App () {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth() as never)
  })

  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={
            <>
              <LandingPage />
            </>
          }
        />
        <Route path='/trader/register/' element={<Register />} />
        <Route path='/trader/login/' element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
