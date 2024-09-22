import HomeNavBar from '@/pages/Home/HomeNavBar'
import { Outlet } from 'react-router-dom'

// interface PropType{
//     children: React.ReactNode
// }

const Layout = () => {
  return (
    <>
    <HomeNavBar/>
    <Outlet/>
    </>
    
  )
}

export default Layout