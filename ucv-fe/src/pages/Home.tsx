import { Navbar } from '../components/Navbar'
import { HeroBanner } from '../components/HeroBanner'
import { AboutUsHome } from '../components/AboutUs-Home'
import { DiscoverSchoolTourHome } from '../components/DiscoverSchoolTour-Home'
import { Testimonials } from '../components/Testimonials'
import ImageCarousel from '../components/ImageCarousel'
import { Footer } from '../components/Footer'
function Home() {
  return (
    <div>
      <Navbar/>
      <div className='mt-20'>
        <HeroBanner/>
        <AboutUsHome/>
        <DiscoverSchoolTourHome/>
        <Testimonials/>
        <ImageCarousel/>
        <Footer/>
      </div>
    </div>
  )
}

export default Home
