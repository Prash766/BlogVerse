import Blog from '@/utils/Blog'
import HomeNavBar from './HomeNavBar'

const Home = () => {
  return (
    <div className='min-h-screen'>
      <header>
      <HomeNavBar/>
      </header>

      <main className='flex flex-col '>
        <Blog/>
        <Blog/>
        <Blog/>
        <Blog/>
        <Blog/>
      


        </main>
    </div>
  )
}

export default Home