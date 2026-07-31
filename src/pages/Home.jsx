import Navbar from "../components/common/Navbar";
import Hero from "../components/common/Hero";
import Features from "../components/common/Features";
import HowItWorks from "../components/common/HowItWorks";
import Footer from "../components/common/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
}

export default Home;