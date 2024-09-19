import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/landingPage/LandingPage"
import Login from "./pages/Auth/Login"
import Signup from "./pages/Auth/Signup"
import Home from "./pages/Home/Home"
import CreateBlog from "./pages/NewBlog/CreateBlog"
import ProtectedRoutes from "./utils/ProtectedRoutes"
import ProfilePage from "./pages/Profile/ProfilePage"
import BlogPage from "./pages/Blog/BlogPage"

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route element={<ProtectedRoutes/>}>
      <Route path='/home' element={<Home/>} />
      <Route path='/write' element={<CreateBlog/>}/>
      <Route path='/profile' element={<ProfilePage/>} />
      <Route path='/blog/:id' element={<BlogPage/>} />
      </Route>
    </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
