import Navbar from '../components/Home/Navbar';
import Home from '../components/Home/Home';
import Testimonials from '../components/Home/Testimonial';
import Footer from "../components/Home/Footer";
import HowItWorks from '../components/Home/HowItWorks';
import KeyFeatures from '../components/Home/KeyFeatures';

const HomePage = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Navbar />
      <Home/>
      <HowItWorks/>
      <KeyFeatures/>
      <Testimonials/>
      <Footer/>
    </div>
  );
}

export default HomePage