import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/landingPage/LandingPage"
import Login from "./pages/Auth/Login"
import Signup from "./pages/Auth/Signup"
import Home from "./pages/Home/Home"
import CreateBlog from "./pages/NewBlog/CreateBlog"

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/home' element={<Home/>} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/write' element={<CreateBlog/>}/>
      <Route path='/signup' element={<Signup/>}/>
    </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
