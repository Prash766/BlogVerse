import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/landingPage/LandingPage"
import Login from "./pages/Auth/Login"
import Signup from "./pages/Auth/Signup"

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
    </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
