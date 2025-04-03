import { Navbar } from '../components/Navbar'
import { HeroBanner } from '../components/HeroBanner'
import { AboutUsHome } from '../components/AboutUs-Home'
import { DiscoverSchoolTourHome } from '../components/DiscoverSchoolTour-Home'
function Home() {

  return (
    <div>
      <Navbar/>
      <div className='mt-20'>
        <HeroBanner/>
        <AboutUsHome/>
        <DiscoverSchoolTourHome/>
      </div>
    </div>
  )
}

export default Home
